# Hungry Slugs Web App

This web app serves as replacement for the current official [UCSC Dining Menus](https://nutrition.sa.ucsc.edu/). However, there are many improvement over the original website:

- This web app is able to display all the foods available at each location in new clean UI which is nice change over the original websites UI.
- Meal times are automatically hidden if they are no longer being offered at a given dining location.
- Rate the quality of a given food at UCSC.
- Comment on a certain food available at UCSC as user signed in or an anonymous user.
- See what other people rated a food.
- Get notified when a food you rated highly is available at a dining location.

All of these new features allow for users to better understand and know about the food at the UCSC dining locations.

## Development Environment Setup

To start developing the Hungry Slugs Web App you need to set up a local development environment. This includes configuring necessary secrets and programs. You will first need to follow the [Secrets](#secrets) guide. It's then recommended that you follow the [nix](#nix) guide and setup the local development environment. Nix will work any Unix based OS (Linux/MacOS/WSL). If you are Windows and want to use Nix then you need to install Windows Subsystem for Linux (WSL). You can install WSL by following the [WSL Installation](https://learn.microsoft.com/en-us/windows/wsl/install) guide. Nix will also work for the x86_64 and 64bit Arm architectures without additional configuration. Nix is the recommended way to setup the local development environment because it is guaranteed to be reproducible. If you do not want to use Nix for any reason then you can follow the [Without Nix](#without-nix) guide.

### Secrets

Make sure to have a private folder in the root directory that contains all secrets. You can get access to this folder using this [Link to a shared Google Drive](https://drive.google.com/drive/folders/1oz7vGXPAI2S8vzYIpQ2ATTfjgqFHDD_p?usp=sharing) if you have access to it. However, if you do not have access to this Google Drive then you can make the secrets your self. What files should go into the private folder will be outlined below:

#### ssl-cert-ucsc.pem

To create this file you need to get the SSL certificate from the [UCSC Menu website](https://nutrition.sa.ucsc.edu/) and add it SSL certificate file from the python certifi library. You can also disable SSL security checks by modifying the web scraping code, but this considered unsafe.

#### secrets.ts

These are the secrets for the front-end of the web app. The variables in this file are:

- export const GOOGLE_CLIENT_ID
- export const GOOGLE_CLIENT_SECRET

#### private_settings.py

These are the secrets for the back-end of the web app. The variables in this file are:

- DJANGO_SECRET_KEY
- MONGODB_USERNAME
- MONGODB_PASSWORD
- MONGODB_CLUSTER
- UCSC_SSL_CERT = "private/ssl-cert-ucsc.pem"
- IS_DEV = True

#### \_\_init\_\_.py

Create this file as well and leave in blank inside of the private folder.

### Nix

Install Nix if it is not already installed. Here is [guide](https://nixos.org/download/) on how to install for your system.

We need to enable nix flakes as this will make running future commands easier. However, it's not completely necessary as it can still be run without enabling flakes but the command to activate the environment will be longer. Here is a [guide](https://nixos.wiki/wiki/Flakes) on how to enable flakes for your system. If you are not using NixOS or Nix Home-Manager then use the command `mkdir -p ~/.config/nix && echo "experimental-features = nix-command flakes" > ~/.config/nix/nix.conf`. What this does is creates a file `nix.conf` with the text, `experimental-features = nix-command flakes`, inside of it inside the `~/.config/nix` folder on your system.

To activate the environment run one of these commands:

#### With Flakes (Recommended):

`nix develop`

#### Without Flakes:

`nix --experimental-features 'nix-command flakes' develop`

#### Note

- You can append `-c $SHELL` to open the Nix shell in your preferred shell like zsh or fish as the default is bash.
- You can update the packages in the flake using `nix flake update` this will change the `flake.lock` if there are update to reflect the new version.
- After setting up the nix environment all the python packages will be install in `_build` folder and the node dependencies will be install in the `node_modules` folder. This folder is in the [.gitignore](./.gitignore) as it should not be uploaded.
- If you are using Visual Studio Code and would like it to recognize what python packages you have installed when using the python extensions ([python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) and [pylance](https://marketplace.visualstudio.com/items?itemName=ms-python.vscode-pylance)), then you have install/use `direnv` with the correct direnv Visual Studio Code [direnv extension](https://marketplace.visualstudio.com/items?itemName=mkhl.direnv). You can install `direnv` by following this guide: [direnv - Installation](https://direnv.net/docs/installation.html).

### Without Nix

This method is not recommended as it less likely to be reproducible. However, I can be easier for some people to setup the environment if they do not have `nix` already setup or you want to run on a non unix environment/system.

#### Python

You need to install python on your system. The python version that was used to create this website is `python 3.11`. However, this may change in the future. You then need to install all of the python dependencies using `pip install -r requirements.txt`.

#### Bun/Npm/Yarn/Pnpm

You need to run install one of the four options `bun`, `npm`, `yarn`, or `pnpm`. All of these should work but what referenced in these docs uses `bun`. You will then need to run the package install command for the program that you installed. For `bun` the command is `bun i` or `bun install`.

## Running Web App

Running the web app requires two steps once your development once your development environment is set up. You need to run two separate terminals with one running the back-end server and the other running the front-end. The commands are listed below:

Back-end: `python backend/manage.py runserver`

Front-end:

_\*Note the command you run depends on what you have installed in your development environment_

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Web App Structure

### Front-end

This web app uses Next.js App Router so each of the websites pages are stored in the [app](./app/) folder. For a better understand of how the app folder works you should read: [Next.js App Router - Routing](https://nextjs.org/docs/app/building-your-application/routing).

The web app also uses the TypeScript language which has the advantage of Static Typing and other improvements which can further explained on the [TypeScript Website](https://www.typescriptlang.org/). Custom types for the project are defined in an the [interfaces](./interfaces/) folder and imported when needed.

There is also a [components](./components/) folder which stores React components that can be imported and used inside of pages.

This web app also utilizes Tailwindcss which is a css framework that can be read more about on the [Tailwindcss Docs](https://tailwindcss.com/docs/installation). Are utilizes Tailwindcss CSS features through by writing Tailwindcss's custom classnames in the classname field on each pages. These custom classnames are then converted to css and associated with each element that has that classname. This allows for faster devolvement as there is less time learning fancy CSS and there is a more consistent website appearance.

On the front-end http requests are made to our back-end using Axios which we define most of the main function requests in [app/requests.ts](./app/requests.ts). There are some other requests throughout the various pages that have not be moved to this file but will moved to this file a later time.

Logging in is also handled on the frontend in the [app/profile/page.tsx](./app/profile/page.tsx) using OAuth. The only method of sign in that is accepted right now is Google because each UCSC student has Google Account. In the future there could be other ways to sign in. The log info (email, name) are sent to the back-end to processed and added to the database.

We also used Figma UI to implement the UI design for each of pages on the web app. The Figma UI designs for each of the pages can be found in the [docs/figma_ui](./docs/figma_ui/). If implementing a new page it could be helpful to implement it Figma before creating the page with code.

All packages for the front-end are defined in the file [package.json](./package.json).

### Back-end

The back-end is made using Django. This back-end is Python based so all the code written for the back-end is in python. All of the back-end code is [backend](./backend/) folder. Inside of this folder there are two main folders one being [backend/backend](./backend/backend/) and the other being [backend/api](./backend/api/). The first is for the setting up the main settings in Django which is mostly done in the [settings](./backend/backend/settings.py) file.

One of the main reasons the back-end was made using Django was that the web scrapping framework used to web scrape the UCSC Food Menu website, BeautifulSoup, is a Python framework. The web scraper can be found in the folder [backed/webscraper](./backend/webscraper/) with the main file being the [food_locations.py](./backend/webscraper/food_locations.py). This web scraper gets all of the foods from each food location on the UCSC campus in its respective categories. It is also able to get the food restriction data which gives information about the allergens and contents of the foods. This web scraper is called by a http request to update the database with the new menus only if an hour has passed since the last update.

All of the http requests are stored in the [backend/backend/urls.py](./backend/backend/urls.py) which imports the [backend/api/urls.py](./backend/api/urls.py). The second file contains all of the http functions that are called on the front-end to our back-end. The main http functions are stored in the [backend/api/views.py](./backend/api/views.py). Http requests for each model are located in `views.py` file in each model folder in [backend/api/model_logic](./backend/api/model_logic/) folder.

All the models that are used on the back-end which interact with the MongoDB are defined in the [backed/api/models.py](./backend/api/models.py) file. In this file there are validators so that every time something is pushed to the database it follow the structure defined in this file. Each of the models CRUD functions are defined in `actions.py` file in each model folder in [backend/api/model_logic](./backend/api/model_logic/) folder. Each of the tests for the models are defined inside of these same folders but in the `tests.py` file.

All packages for the back-end are defined in the file [requirements.txt](./requirements.txt).

## Running Unit Tests

To run tests to check the CRUD functions for each of the models on the back-end you can run from the root of the repository:

`python backend/manage.py test backend/api --shuffle`

This runs all the tests found in the back-end api folder. This also shuffles the order of the tests so that one test running before another does not change the test results. Currently there are only tests for the back-end models and in the future tests can be added for http calls and front-end actions.

## Style Guide

### Overall

- Focus on simple and clean code that easily readable/understandable for other people.

### Front-end

- Each page made should roughly follow the same style as the Next.js website for how to create a page: [Next.js Docs - Pages](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts);
- In general use as many features from Next.js instead of using older features from React.js.
- All front-end code should be written in TypeScript and each custom model fetched from the backend should have interfaced defined that TypeScript can use.
- All the code written should be formatted with `prettier`. This can be done by running the command: `bunx prettier * --write`. This will format all files used by the front-end.

### Back-end

- All the code written should be formatted with python `black`. This can be done by running the command: `black backend/**/*.py`. This will format all the python files on the back-end.

## Known Bugs

### Major Bugs

- Dynamic routes issue related to inputting incorrect url paths will lead to an indefinite loading screen on pages that url to determine inputs for http requests.
- Cannot save images to the database and thus preventing us from fetching these images to display them to users.

### Minor Bugs

- Anonymous users are all considered the same user across all website sessions.
- A long delay (about 10 seconds) when loading the home page due to the data being web scraped when it has been a long enough interval for it to be updated.
- A long delay (about 5 seconds) when clicking on a location. It is not fully known why this is happening but it assumed that is related the http request to fetch all the data takes too long.
- A new rating will not remain displayed when opening and closing a food category. However, the backend maintains the change, so when reloading the page the new rating will appear correctly.
- A new comment will not remain displayed when switching pages on the food item page. However, the back-end maintains the change, so when reloading the page the new comment will appear correctly. Also, if another user comments while you are viewing the comment page it will not appear until you reload the page.
- Errors related using LocalStorage are thrown in the console when using the search features on the website. However, the search still works with all of its functionality.
- Users must click on the text of the buttons on the locations page to get to the food page.
- Some of the styling varies between pages.
- Some fonts and minor styling may vary depending on the OS or browser of the user.
- The food data for the locations can be inaccurate if the location does not have anything currently offered.

## Technologies Used

### Front-end

- Next.js
- Tailwindcss
- React
- Axios
- TypeScript
- OAuth
- Prettier
- Figma

### Back-end

- Django
  - Django Cors Headers
  - Django Rest Framework
- MongoDB
  - PyMongo
- BeautifulSoup
- Python Black

### DevOps

- Github
- Google Drive
- Discord

## Scrum Documents

All scrum documents can be found in the [docs](./docs/) folder.
