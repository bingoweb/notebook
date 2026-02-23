import os
import random
import requests
import logging
import traceback
from flask import Flask, jsonify, render_template

# Configure logging
logging.basicConfig(filename='app.log', level=logging.INFO,
                    format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')

app = Flask(__name__)

# GitHub API Arama Fonksiyonu
def find_colab_project():
    """
    GitHub API'sini kullanarak Colab ile uyumlu projeleri arar.
    Birden fazla deneme yaparak uygun bir proje bulmaya çalışır.
    """
    queries = [
        '"Open in Colab" in:readme org:google',
        'extension:ipynb org:tensorflow',
        'extension:ipynb org:pytorch',
        'extension:ipynb org:huggingface',
        '"Colab Notebook" in:readme'
    ]

    token = os.environ.get('GITHUB_TOKEN')
    headers = {}
    if token:
        headers['Authorization'] = f"token {token}"

    # Maksimum 10 deneme yap
    for _ in range(10):
        try:
            query = random.choice(queries)
            url = f"https://api.github.com/search/repositories?q={query}&sort=stars&order=desc"

            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()

            if not data.get('items'):
                logging.warning(f"No items found for query: {query}. Retrying...")
                continue # Sonraki denemeye geç

            project = random.choice(data['items'])
            repo_name = project['full_name']

            # Proje içindeki .ipynb dosyasını bul
            files_url = f"https://api.github.com/repos/{repo_name}/contents"
            files_response = requests.get(files_url, headers=headers)
            files_response.raise_for_status()
            files_data = files_response.json()

            notebook = None
            for file_item in files_data:
                if isinstance(file_item, dict) and file_item.get('name', '').endswith('.ipynb'):
                    notebook = file_item
                    break

            if notebook:
                colab_url = f"https://colab.research.google.com/github/{repo_name}/blob/master/{notebook['name']}"
                return {
                    'name': project.get('name'),
                    'description': project.get('description'),
                    'colab_url': colab_url
                }

            # .ipynb bulunamadıysa Colab rozetini ara
            readme_url = f"https://raw.githubusercontent.com/{repo_name}/master/README.md"
            readme_response = requests.get(readme_url)
            if readme_response.status_code == 200 and "colab.research.google.com/assets/colab-badge.svg" in readme_response.text:
                import re
                match = re.search(r'href="([^"]*colab.research.google.com[^"]*)"', readme_response.text)
                if match:
                    return {
                        'name': project.get('name'),
                        'description': project.get('description'),
                        'colab_url': match.group(1)
                    }

            logging.warning(f"No usable notebook or badge found in {repo_name}. Retrying...")
            # Uygun dosya bulunamazsa döngü devam eder

        except requests.exceptions.RequestException as e:
            logging.error(f"GitHub API request failed during attempt: {e}")
            continue # Hata durumunda da sonraki denemeye geç
        except Exception as e:
            logging.error(f"An unexpected error occurred in find_colab_project: {e}")
            logging.error(traceback.format_exc())
            continue # Beklenmedik bir hatada da sonraki denemeye geç

    logging.error("Failed to find a suitable project after multiple attempts.")
    return None # Tüm denemeler başarısız olursa None döndür

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/find-project')
def find_project_endpoint():
    try:
        project = find_colab_project()
        if project:
            return jsonify(project)
        return jsonify({'error': 'Uygun bir proje bulunamadı. Lütfen tekrar deneyin.'}), 500
    except Exception as e:
        logging.error(f"An error occurred in find_project_endpoint: {e}")
        logging.error(traceback.format_exc())
        return jsonify({'error': 'Sunucuda beklenmedik bir hata oluştu.'}), 500

if __name__ == '__main__':
    app.run(debug=False)