from fastapi import FastAPI, HTTPException
from api.sql_alchemy_models import *
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:8082",
    # Add more origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}


@app.post("/player")
def read_player(data: dict = Body(...)):
    player_name = data.get("player_name")
    print(player_name)
    player = get_player(player_name)
    if player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    return player

@app.post("/player/box_scores")
def read_box_scores(data: dict = Body(...)):
    player_name = data.get("player_name")
    box_scores = get_box_score_by_player(player_name)
    if not box_scores:
        raise HTTPException(status_code=404, detail="Box scores not found")
    return box_scores

@app.post("/player/last_x_games")
def read_last_x_games(data: dict = Body(...)):
    player_name = data.get("player_name")
    x = data.get("x", 5)
    last_games = get_last_x_games(player_name, x)
    if not last_games:
        raise HTTPException(status_code=404, detail="Games not found")
    return last_games

@app.post("/player/rolling_averages")
def read_rolling_averages(data: dict = Body(...)):
    player_name = data.get("player_name")
    x = data.get("x", 5)
    rolling_averages = get_rolling_averages(player_name, x)
    if rolling_averages is None:
        raise HTTPException(status_code=404, detail="Averages not found")
    return rolling_averages

@app.post("/player/season_averages")
def read_season_averages(data: dict = Body(...)):
    player_name = data.get("player_name")
    season_averages = get_season_averages(player_name)
    if season_averages is None:
        raise HTTPException(status_code=404, detail="Averages not found")
    return season_averages

@app.post("/player/best_scoring_game")
def read_best_scoring_game(data: dict = Body(...)):
    player_name = data.get("player_name")
    best_game = get_best_scoring_game(player_name)
    if best_game is None:
        raise HTTPException(status_code=404, detail="Best scoring game not found")
    return best_game

@app.post("/player/worst_scoring_game")
def read_worst_scoring_game(data: dict = Body(...)):
    player_name = data.get("player_name")
    worst_game = get_worst_scoring_game(player_name)
    if worst_game is None:
        raise HTTPException(status_code=404, detail="Worst scoring game not found")
    return worst_game

@app.post("/player/get_games")
def read_games(data: dict = Body(...)):
    player_name = data.get("player_name")
    games = get_games_played(player_name)
    if not games:
        raise HTTPException(status_code=404, detail="Games not found")
    return games

@app.post("/player/get_schedule")
def read_games(data: dict = Body(...)):
    player_name = data.get("player_name")
    games = schedule_with_box_score(player_name)
    if not games:
        raise HTTPException(status_code=404, detail="Games not found")
    return games

@app.post("/player/high_turnover_games")
def read_high_turnover_games(data: dict = Body(...)):
    player_name = data.get("player_name")
    threshold = data.get("threshold", 3)
    high_turnover_games = get_high_turnover_games(player_name, threshold)
    if not high_turnover_games:
        raise HTTPException(status_code=404, detail="High turnover games not found")
    return high_turnover_games

@app.post("/player/high_3pt_games")
def read_high_3pt_games(data: dict = Body(...)):
    player_name = data.get("player_name")
    threshold = data.get("threshold", 0.4)
    high_3pt_games = get_high_3pt_games(player_name, threshold)
    if not high_3pt_games:
        raise HTTPException(status_code=404, detail="High 3-point games not found")
    return high_3pt_games

@app.post("/player/training_recommendations")
def read_training_recommendations(data: dict = Body(...)):
    player_name = data.get("player_name")
    recommendations = generate_training_recommendations(player_name)
    if not recommendations:
        raise HTTPException(status_code=404, detail="Training recommendations not found")
    return recommendations

@app.post("/player/training_recommendations_gpt")
def read_training_recommendations(data: dict = Body(...)):
    player_name = data.get("player_name")
    recommendations = get_ai_recommendations(player_name)
    if not recommendations:
        raise HTTPException(status_code=404, detail="Training recommendations not found")
    return recommendations

@app.get("/players")
def read_players():
    players = get_all_players()
    if not players:
        raise HTTPException(status_code=404, detail="Players not found")
    return players


@app.get("/drills")
def read_drills():
    drills = get_drills()
    if not drills:
        raise HTTPException(status_code=404, detail="Drills not found")
    return drills