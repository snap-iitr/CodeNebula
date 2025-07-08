import os
import random
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import tempfile
import time

load_dotenv()
# Configs and constants
CSES_BASE_URL = "https://cses.fi"
CSES_PROBLEMS_URL = "https://cses.fi/problemset/"
CSES_LOGIN_URL = "https://cses.fi/login/"
CSES_SUBMIT_URL_TEMPLATE = "https://cses.fi/problemset/submit/{problem_id}/"

# Your CSES credentials
CSES_USERNAME = os.getenv("CSES_USERNAME")
CSES_PASSWORD = os.getenv("CSES_PASSWORD")

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
