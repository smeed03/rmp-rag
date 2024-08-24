import requests
from bs4 import BeautifulSoup
import json
import os

# Base URL for the search (ensure the number is replaced according to the university search results in RMP.)
base_url = 'https://www.ratemyprofessors.com/search/professors/1025?q=*'

# Output file path
output_file = 'path/to/file/rmp-rag/professors.json'

all_professors = []

#Functiomn to scrap the info of prof
def scrape_page(url):
    response = requests.get(url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find all the professor cards
    professor_cards = soup.find_all('a', class_='TeacherCard__StyledTeacherCard-syjs0d-0')

    for card in professor_cards:
        # Extract professor details
        name = card.find('div', class_='CardName__StyledCardName-sc-1gyrgim-0').text.strip()
        department = card.find('div', class_='CardSchool__Department-sc-19lmz2k-0').text.strip()
        school = card.find('div', class_='CardSchool__School-sc-19lmz2k-1').text.strip()
        quality_rating = card.find('div', class_='CardNumRating__CardNumRatingNumber-sc-17t4b9u-2').text.strip()
        num_ratings = card.find('div', class_='CardNumRating__CardNumRatingCount-sc-17t4b9u-3').text.strip()
        would_take_again = card.find('div', class_='CardFeedback__CardFeedbackNumber-lq6nix-2').text.strip()
        difficulty = card.find_all('div', class_='CardFeedback__CardFeedbackNumber-lq6nix-2')[1].text.strip()

        # Add the professor details to the list
        all_professors.append({
            "name": name,
            "department": department,
            "school": school,
            "quality_rating": quality_rating,
            "num_ratings": num_ratings,
            "would_take_again": would_take_again,
            "difficulty": difficulty
        })

# Start scraping from the page
scrape_page(base_url)

# Write the results to a JSON file
with open(output_file, 'w') as f:
    json.dump(all_professors, f, indent=4)

print(f'Successfully scraped {len(all_professors)} professors and saved to {output_file}')
