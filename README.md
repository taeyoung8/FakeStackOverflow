[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/9NDadFFr)
Add design docs in *images/*

## Instructions to setup and run project

# Technologies Used
- Frontend: React
- HTTP Requests: Axios
- Backend: Express, Express-session, cors, mongoose
- Database: Mongoose(MongoDB)
- Authentication: Bcrypt

# Requirements
- Node.js installed on your computer
- MongoDB installed and running on your computer

# Instruction to setup Requirements
- Node.js For Windows/Mac OS:
1. Visit the official MongoDB website(https://www.mongodb.com/try/download/community), follow instructions to download the installer with appropriate operating system(Windows/Mac OS).
2. Run the installer and choose version and follow the installation wizard.
3. To verify the installation, open a termial or a command prompt and run the command 'node -v' to check the version of Node.js and 'npm -v' to check that npm is installed

- MongoDB For Windows:
1. Follow the instruction of the official documentation(https://www.mongodb.com/docs/manual/administration/install-community/) to install MongoDB with appropriate operating system(ex: Windows).
2. Select the "Community Server" tab from the website and download the installer.
3. Run the downloaded .msi file and follow the install wizard.
4. Check the directory that you installed MongoDB to Add 'bin' folder of MongoDB to the PATH environment variable to access from command-line.
If you did not change the installation directory, MongoDB 'bin' folder will be installed in 'C:\Program Files\MongoDB\Server\{MongoDB version}\bin'
5. Right click on the 'This PC' on the desktop or in Windows and select 'Properties'.
6. Click 'Advanced system settings'
7. Click 'Advanced' Tab in the System Properties window
8. Click on the 'Environment Variables' buttton.
9. Under 'System Variables' section, select 'PATH' variable
10. Click 'edit', and in the 'Edit Environment Variable' window, click 'New' and and  the path to the MongoDB 'bin' directory.
11. Click 'OK' and close.
12. To verify the installation, open a new command prompt window, type 'mongo --version' and press enter. If MongoDB 'bin' was added to your path successfully, it will display the version of MongoDB.

- MongoDB For MacOS:
1. Follow the instruction of the official documentation(https://www.mongodb.com/docs/manual/administration/install-community/) to install MongoDB with appropriate operating system(ex: Mac OS).
2. Run the installer and choose version and follow the installation wizard.
3. Open your terminal and edit your shell profile.
4. Edit your shell profile file by running 'nano ~/.bash_profile' and add 'export PATH=<path-to-mongodb-directory>/bin:$PATH' to MongoDB binaries
5. Save changes and run 'source ~/.bash_profile' to apply the changes
6. To verify the installation, run 'mongo --version' in your terminal. If MongoDB was installed successfully, it will display the version of MongoDB.

# Steps
1. Clone the Fake StackOverflow repository by either downloading as ZIP and extracting it or with Git Bash with the following command: git clone "git@github.com:sbu-ckane-f23-cse316-projectorg/projectfakeso-twogether.git"
2. In the first terminal, navigate to client directory and install the required npm packages with following command
- npm install
3. In the second terminal, navigate to server directory and install the required npm packages with following command
- npm install
4. In the third terminal from any directory, run "mongod" to run the MongoDB.
5. Run node '.\init.js "admin email" "admin password"' in the server terminal replacing the admin email with your desired email for administrator along with your admin password
6. For starting  the server, run npm start "secret key", replacing "secret key" with your key you want to use for secret in express sessions  
7. Run npm start on client terminal to start the site.
8. In your browser(chrome recommended), if not opened automatically, open 'http://localhost:3000'.

## Nick's Contribution
- Implementation of Welcome/Login/Register Page
- Implementation of User Profile Page
- Implementation of Comments
- Created a UML class diagram
- Checked for bugs and made necessary corrections.

## Tae Young's Contribution
- Implementation of vote function for question, answer, and comment
- Styling of Welcome/Login/Register Page
- Styling of Comments
- Created a UML class diagram
- Checked for bugs and made necessary corrections.
