from flask import Flask, request, jsonify, send_from_directory
import json
import os
import time

app = Flask(__name__)

CONTACTS_FILE = 'contacts.json'

@app.after_request
def add_cors_headers(response):
    """Allow the Capacitor Android/iOS app to use a deployed chat server."""
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response

def load_contacts():
    if os.path.exists(CONTACTS_FILE):
        with open(CONTACTS_FILE, 'r') as f:
            data = json.load(f)
            # ensure it's list of dicts
            if isinstance(data, list) and data and isinstance(data[0], dict):
                return data
            else:
                # migrate old list of strings
                return [{'name': name, 'tel': ''} for name in data]
    return [{'name': 'Machugu Jr.', 'tel': ''}]

def save_contacts(contacts):
    with open(CONTACTS_FILE, 'w') as f:
        json.dump(contacts, f)

def load_messages(user):
    file = f'messages_{user}.json'
    if os.path.exists(file):
        with open(file, 'r') as f:
            messages = json.load(f)
            if not messages:  # if empty, add initial
                if user == 'Machugu Jr.':
                    messages = [
                        { 'text': 'Hi there!', 'sender': 'Machugu Jr.', 'timestamp': int(time.time() * 1000 - 60000), 'read': True },
                        { 'text': 'How are you?', 'sender': 'Machugu Jr.', 'timestamp': int(time.time() * 1000 - 30000), 'read': True }
                    ]
                with open(file, 'w') as f:
                    json.dump(messages, f)
            return messages
    else:
        # create and add initial
        messages = []
        if user == 'Machugu Jr.':
            messages = [
                { 'text': 'Hi there!', 'sender': 'Machugu Jr.', 'timestamp': int(time.time() * 1000 - 60000), 'read': True },
                { 'text': 'How are you?', 'sender': 'Machugu Jr.', 'timestamp': int(time.time() * 1000 - 30000), 'read': True }
            ]
        with open(file, 'w') as f:
            json.dump(messages, f)
        return messages

def save_messages(user, messages):
    with open(f'messages_{user}.json', 'w') as f:
        json.dump(messages, f)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

@app.route('/contacts', methods=['GET'])
def get_contacts():
    return jsonify(load_contacts())

@app.route('/contacts', methods=['POST'])
def add_contact():
    data = request.json
    name = data.get('name')
    tel = data.get('tel', '')
    if name:
        contacts = load_contacts()
        if name not in [c['name'] for c in contacts]:
            contacts.append({'name': name, 'tel': tel})
            save_contacts(contacts)
        return jsonify({'success': True})
    return jsonify({'success': False}), 400

@app.route('/messages/<user>', methods=['GET'])
def get_messages(user):
    return jsonify(load_messages(user))

@app.route('/messages/<user>', methods=['POST'])
def add_message(user):
    data = request.json
    messages = load_messages(user)
    messages.append(data)
    save_messages(user, messages)
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)
