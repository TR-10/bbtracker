#install homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"brew install --cask visual-studio-code
#install visual studio code
brew install --cask visual-studio-code
#install node
brew install node
brew install pyenv
pyenv install 3.11.0
pip install pipenv
pipenv install
pipenv run uvicorn api.main:app --reload
sudo npm install -g yarn
npx expo start