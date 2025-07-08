const pool = require('../config/database');

exports.GameData = async (req, res) => {
  let userdata = req.user;
  let UserID = req.body.UserID;
  if(UserID){
    let [data]  = await pool.query(
      `SELECT 
          g.id AS id,
          CASE 
              WHEN g.player1_id = ? THEN u2.username
              ELSE u1.username
          END AS opponent_username,
          g.winner_id AS winner_id,
          g.stake_amount AS stake_amount,
          g.completed_at AS completed_at
      FROM games g
      JOIN users u1 ON g.player1_id = u1.id
      JOIN users u2 ON g.player2_id = u2.id
      WHERE g.player1_id = ? OR g.player2_id = ?;`,
      [UserID, UserID, UserID]
    );
    res.json(data);
  }
  else{
    let [data]  = await pool.query(
      'SELECT * FROM games WHERE player1_id = ? OR player2_id = ?',
      [userdata.id,userdata.id]
    );
    data.push({
      id: userdata.id,
      username: userdata.username,
      email: userdata.email,
      wallet_address: userdata.wallet_address
    });
    res.json(data);
  }

};

exports.PlayerData = async (req, res) => {
  let userdata = req.user;
  let UserID = req.body.UserId;
  if(UserID!=userdata.id){
    let [status] = await pool.query(
      'SELECT status FROM friends WHERE (requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?)',
      [userdata.id, UserID, UserID, userdata.id]
    );
    if(!status || status.length === 0 || status[0].status === false){
      return res.status(400).json({ status: 0, error: 'You are not friends with this user' });
    }
  }

  let [data]  = await pool.query(
    'SELECT * FROM users WHERE id = ?',
    [UserID]
  );
  res.json(data[0]);
};

exports.PlayerMatchesData = async (req, res) => {
  let userdata = req.user;
  let UserID = req.body.UserId;
  if(UserID!=userdata.id){
    let [status] = await pool.query(
      'SELECT status FROM friends WHERE (requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?)',
      [userdata.id, UserID, UserID, userdata.id]
    );
    if(!status || status.length === 0 || status[0].status === false){
      return res.status(400).json({ status: 0, error: 'You are not friends with this user' });
    }
  }

  let [data]  = await pool.query(
    'SELECT * FROM games WHERE player1_id = ? OR player2_id = ?',
    [UserID,UserID]
  );
  res.json(data);
};

exports.LeaderboardData = async (req, res) => {
  let [data]  = await pool.query(
    `WITH total_games AS (
        SELECT 
            u.id AS user_id,
            COUNT(g.id) AS total_matches
        FROM users u
        LEFT JOIN games g 
            ON u.id = g.player1_id OR u.id = g.player2_id
        GROUP BY u.id
    ),
    wins_and_eth AS (
        SELECT 
            u.id AS user_id,
            COUNT(g.id) AS won_matches,
            ROUND(SUM(g.stake_amount * 1.8), 3) AS eth_earned
        FROM users u
        JOIN games g 
            ON u.id = g.winner_id
        GROUP BY u.id
    ),
    final_stats AS (
        SELECT
            u.id,
            u.username,
            COALESCE(tg.total_matches, 0) AS totalMatches,
            COALESCE(we.won_matches, 0) AS wonMatches,
            COALESCE(we.eth_earned, 0) AS ethEarned,
            ROUND(
                100.0 * COALESCE(we.won_matches, 0) / NULLIF(COALESCE(tg.total_matches, 0), 0),
                2
            ) AS winPercentage
        FROM users u
        LEFT JOIN total_games tg ON u.id = tg.user_id
        LEFT JOIN wins_and_eth we ON u.id = we.user_id
    )
    SELECT
        id,
        RANK() OVER (
            ORDER BY wonMatches DESC, totalMatches
        ) AS u_rank,
        username,
        winPercentage,
        ethEarned,
        totalMatches,
        wonMatches
    FROM final_stats
    WHERE totalMatches > 0
    ORDER BY wonMatches DESC, totalMatches
    LIMIT 10;`
  );
  res.json(data);
};
