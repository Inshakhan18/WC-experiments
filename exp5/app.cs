body {
  font-family: "Poppins", sans-serif;
  background: linear-gradient(to right, #e6f0ff, #f7fbff);
  margin: 0;
  padding: 0;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.form {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.form-heading {
  text-align: center;
  color: #1e2a3a;
  margin-bottom: 20px;
  font-weight: 600;
}

label {
  font-weight: 500;
  margin-top: 10px;
  display: block;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 15px;
  transition: border-color 0.3s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #007bff;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.register-btn,
.clear-btn {
  flex: 1;
  padding: 10px;
  margin: 0 5px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.register-btn {
  background-color: #8a3f3f;
  color: white;
}

.clear-btn {
  background-color: #e0e0e0;
  color: #333;
}

.register-btn:hover {
  background-color: #6b2d2d;
}

.clear-btn:hover {
  background-color: #c9c9c9;
}
