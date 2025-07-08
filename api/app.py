from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
from selenium import webdriver
from utils import get_random_problem, login_cses, submit_code_cses

load_dotenv()
app = Flask(__name__)
CORS(app)

# Compiler API Key and code file path same as before
COMPILER_RAPID_API = os.getenv("COMPILER_RAPID_API")

@app.route('/random_problem', methods=['GET'])
def random_problem():
    print("Fetching a random problem...")
    problem = get_random_problem()
    return jsonify({
        'id': problem['id'],
        'name': problem['name'],
        'url': problem['url'],
        'html': problem['html']
    })

@app.route('/run', methods=['POST'])
def run():
    data = request.get_json()
    print(data);
    language = data.get('languageCode', 17)  # default to 17 if not provided
    input_data = data.get('input', '')
    code = data.get('code', '')
    url = "https://code-compiler.p.rapidapi.com/v2" # https://rapidapi.com/abdheshnayak/api/code-compiler

    payload = {
        "LanguageChoice": language,
        "Program": code,
        "Input": input_data
    }
    headers = {
        "x-rapidapi-key": COMPILER_RAPID_API,
        "x-rapidapi-host": "code-compiler.p.rapidapi.com",
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        result = response.json()
        print(result["Result"])
        if result["Errors"]:
            return str(result["Result"])
        else:
            return str(result["Result"])
    else:
        return str(f"Error: {response.status_code}, {response.text}")

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    problem_id = data.get('problemID', '3357')  # default example problem id
    language = data.get('selectedLanguage', "C++")  # language id for CSES
    code = data.get('code',' ')
    language_extension = data.get('languageExtension','.cpp')
    print(f"Submitting code for problem {problem_id} in {language}...")
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=chrome_options)
    try:    
        login_cses(driver)
        result = submit_code_cses(driver, problem_id, language, code, language_extension)
    except Exception as e:
        print(f"An error occurred: {e}")
        return f"Error: {str(e)}", 500
    finally:
        driver.quit()

    return str(result)

if __name__ == '__main__':
    app.run(port=8000, debug=True)