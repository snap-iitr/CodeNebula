const pool = require('../config/database');

exports.addFriend = async (req, res) => {
  let userdata = req.user;
  const { FriendId } = req.body;

  const [result] = await pool.query(
    'SELECT * FROM friends WHERE requester_id = ? AND addressee_id = ?',
    [FriendId, userdata.id]
  );
  if(result.length > 0){
    await pool.query(
      'UPDATE friends SET status = TRUE WHERE requester_id = ? AND addressee_id = ?',
      [FriendId, userdata.id]
    );
  }
  else {
    await pool.query(
      'INSERT INTO friends (requester_id, addressee_id, status) VALUES (?, ?, FALSE)',
      [userdata.id, FriendId]
    );
  }
  res.send("Done!");
};

exports.searchFriend = async (req, res) => {
  let userdata = req.user;
  const { searchQuery } = req.body;
  let [data]  = await pool.query(
    `SELECT
      u.id AS id,
      u.username AS username,
      u.wallet_address AS walletAddress,
      '👑' AS avatar
    FROM users u
    WHERE u.id != ?
      AND (
        u.username LIKE CONCAT('%', ? , '%')
        OR u.wallet_address LIKE CONCAT('%', ? , '%')
        OR u.email LIKE CONCAT('%', ? , '%')
      )
      AND u.id NOT IN (
        SELECT
          CASE
            WHEN f.requester_id = ? THEN f.addressee_id
            ELSE f.requester_id
          END
        FROM friends f
        WHERE (f.requester_id = ? OR f.addressee_id = ?)
      );`,
    [userdata.id,searchQuery,searchQuery,searchQuery,userdata.id,userdata.id,userdata.id]
  );
  res.json(data);
};

exports.getFriend = async (req, res) => {
  let userdata = req.user;
  let [data]  = await pool.query(
    `SELECT 
      u.id AS id,
      u.username,
      u.wallet_address AS walletAddress,
      '👑' AS avatar,

      COUNT(g.id) AS gamesPlayed,
      COUNT(CASE WHEN g.winner_id = u.id THEN 1 END) AS gamesWon

    FROM friends f

    JOIN users u ON u.id = 
      CASE 
        WHEN f.requester_id = ? THEN f.addressee_id
        WHEN f.addressee_id = ? THEN f.requester_id
      END

    LEFT JOIN games g ON (g.player1_id = u.id OR g.player2_id = u.id)

    WHERE f.status = TRUE
      AND (? IN (f.requester_id, f.addressee_id))

    GROUP BY u.id, u.username, u.wallet_address;`,
    [userdata.id,userdata.id,userdata.id]
  );
  let [data2]  = await pool.query(
    `SELECT 
      u.id AS id,
      u.username,
      u.wallet_address AS walletAddress,
      '👑' AS avatar
    FROM friends f
    JOIN users u ON u.id = f.requester_id
    WHERE f.addressee_id = ?
      AND f.status = FALSE;`,
    [userdata.id]
  );
  res.json({
    "Friends" : data,
    "FriendsRequests" : data2
  });
};

exports.resultFriendRequests = async (req, res) => {
  let userdata = req.user;
  const { requestId , value } = req.body;

  if(value){
    await pool.query(
      'UPDATE friends SET status = TRUE WHERE requester_id = ? AND addressee_id = ?',
      [requestId, userdata.id]
    );
  }
  else {
    await pool.query(
      'DELETE FROM friends WHERE requester_id = ? AND addressee_id = ?',
      [requestId, userdata.id]
    );
  }
  res.send("Done!");
};
