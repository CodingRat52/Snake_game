from flask import Flask, render_template, request, jsonify
import sqlite3

<<<<<<< HEAD
app = Flask (__name__)
@app.route("/")
def home() :
    return render_template("index.html")
app.run(debug=True)

=======
app = Flask(__name__)
>>>>>>> 6192e72d679513fc60f1d6685f20faab903e3fad

def init_db():
    conn = sqlite3.connect('snake.db')
    c = conn.cursor()
    c.execute('CREATE TABLE IF NOT EXISTS scores (id INTEGER PRIMARY KEY, score INTEGER)')
    conn.commit()
    conn.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit_score', methods=['POST'])
def submit_score():
    score = request.json.get('score')
    conn = sqlite3.connect('snake.db')
    c = conn.cursor()
    c.execute('INSERT INTO scores (score) VALUES (?)', (score,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Score saved'})

@app.route('/high_scores')
def high_scores():
    conn = sqlite3.connect('snake.db')
    c = conn.cursor()
    c.execute('SELECT score FROM scores ORDER BY score DESC LIMIT 5')
    scores = c.fetchall()
    conn.close()
    return jsonify([s[0] for s in scores])

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
