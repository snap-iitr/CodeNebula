from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import random
import os
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import tempfile
import time

# Configs and constants
CSES_BASE_URL = "https://cses.fi"
CSES_PROBLEMS_URL = "https://cses.fi/problemset/"
CSES_LOGIN_URL = "https://cses.fi/login/"
CSES_SUBMIT_URL_TEMPLATE = "https://cses.fi/problemset/submit/{problem_id}/"

# Your CSES credentials
CSES_USERNAME = os.getenv("CSES_USERNAME")
CSES_PASSWORD = os.getenv("CSES_PASSWORD")

# Compiler API Key and code file path same as before
COMPILER_RAPID_API = os.getenv("COMPILER_RAPID_API")

load_dotenv()
app = Flask(__name__)
CORS(app)

def get_problem_to_html(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    content_div = soup.find('div', class_='content')
    if content_div.find('img'):
        return get_problem_to_html(url)
    return str(content_div).replace('h1', 'h3')

def get_random_problem():
    # Scrape CSES problemset page to get all problems and their points
    response = requests.get(CSES_PROBLEMS_URL)
    soup = BeautifulSoup(response.text, 'html.parser')

    table = soup.find('div', class_='content')

    rows = table.find_all('ul')[1:]  # Skip header
    row = random.choice(rows)
    cols = row.find_all('li')
    col = random.choice(cols)

    problem_link = col.find('a')
    problem_name = problem_link.text.strip()
    problem_url = CSES_BASE_URL + problem_link['href']
    problem_id = problem_link['href'].split('/')[-1]  # e.g., /problemset/task/1640/ => 1640

    problem = {
        'id': problem_id,
        'name': problem_name,
        'url': problem_url,
        'html': get_problem_to_html(problem_url)
    }
    print(f"Selected problem: {problem_name} (ID: {problem_id})")
    return problem

def login_cses(driver):
    driver.get(CSES_LOGIN_URL)
    time.sleep(3)
    username_input = driver.find_element(By.NAME, "nick")
    password_input = driver.find_element(By.NAME, "pass")

    username_input.send_keys(CSES_USERNAME)
    password_input.send_keys(CSES_PASSWORD)
    password_input.send_keys(Keys.RETURN)
    time.sleep(3)  # Wait for login

def submit_code_cses(driver, problem_id, language_id, code, language_extension):
    print(f"Submitting code for problem {problem_id} in language Extension {language_extension}...")
    submit_url = CSES_SUBMIT_URL_TEMPLATE.format(problem_id=problem_id)
    driver.get(submit_url)
    time.sleep(3)

    # Fill language dropdown
    language_select = driver.find_element(By.NAME, "lang")
    for option in language_select.find_elements(By.TAG_NAME, "option"):
        if option.get_attribute("value") == str(language_id):
            option.click()
            break
        
    time.sleep(1)

    # Write code to a temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=language_extension, mode='w') as temp_file:
        temp_file.write(code)
        temp_file_path = temp_file.name

    code_area = driver.find_element(By.CSS_SELECTOR, "input[type='file']")
    # CSES uses a textarea for code input
    code_area.send_keys(temp_file_path)
    time.sleep(2)
    # Submit button
    submit_button = driver.find_element(By.CSS_SELECTOR, "input[type='submit']")
    submit_button.click()
    time.sleep(5)  # Wait for submission
    summary_table = driver.find_element(By.CLASS_NAME, "summary-table")
    verdict_status = driver.find_element(By.ID,"status").text.strip()
    print(verdict_status)
    if(verdict_status == "READY"):
        verdict_element = summary_table.find_element(By.CLASS_NAME, "inline-score")
        verdict_text = verdict_element.text.strip()
        return verdict_text
    return verdict_status

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
