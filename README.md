# rule_app

Setup Instructions
1. Clone the Repository
git clone https://github.com/savan590/rule_app.git
cd rule_app

3. Running with Docker
Make sure you have Docker and Docker Compose installed.

Build and run the application using Docker Compose:

docker-compose up --build

Open the application:
Frontend: http://localhost:3000
Backend: http://localhost:5000

3. Services
Backend: Node.js + Express app running on port 5000.
Frontend: React app running on port 3000.
MongoDB: MongoDB container running on port 27017.

4. Testing the Setup
After running the application, verify:

Backend api is available at http://localhost:5000/api/rules.
Frontend is accessible at http://localhost:3000.
