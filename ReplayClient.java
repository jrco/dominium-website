package com.replay;

import Utilities.Messenger;
import com.logic.CapturePoint;
import com.logic.GameState;
import com.logic.Team;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class ReplayClient {

	private static ReplayClient instance;

	private final String SERVER_URL = "http://localhost";
	private final String SERVER_PORT = "80";
	private final int UPDATE_INTERVAL = 1000;

	private final HashMap<String,GameState> gameStates = new HashMap<>();

	protected ReplayClient(){
		new Thread(){
			public void run(){
				while(true) {
					synchronized (gameStates) {
						//Send all gamestates
						Iterator<Map.Entry<String, GameState>> it = gameStates.entrySet().iterator();
						while (it.hasNext()) {
							Map.Entry<String, GameState> entry = it.next();
							//Send gamestate
							updateGameState(entry.getKey(), entry.getValue());

							//If the game is over, remove from list
							if (entry.getValue().isGameOver()) {
								System.out.println(Messenger.newMessage(Messenger.Type.SERVICE, "Game has finished - Removing from replay list"));
								it.remove();
							}
						}
					}
					try {
						Thread.sleep(UPDATE_INTERVAL);
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				}
			}
		}.start();
	}

	public static ReplayClient getInstance(){
		if(instance == null){
			instance = new ReplayClient();
		}
		return instance;
	}

	private String getServerURL(){
		return SERVER_URL+":"+SERVER_PORT;
	}
	private String getGameURL(){ return getServerURL()+"/games";}
	private String getGameStateURL(String id){ return getGameURL()+"/"+id+"/gamestate";}

	private String getDateTimeStamp(){
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		return LocalDateTime.now().format(formatter);
	}

	public void bindGameState(String title, GameState gs){
		new Thread(){
			public void run(){
				String id = createGame(title,"Braga");
				if(id != null){
					synchronized (gameStates){
						gameStates.put(id,gs);
					}
				}
				else{
					System.out.println(Messenger.newMessage(Messenger.Type.WARNING, "Unable to create game in replay server"));
				}
			}
		}.start();
	}


	private String createGame(String roomTitle, String location){
		String id;
		try {
			JSONObject json = new JSONObject();
			json.put("name_of_room", roomTitle);
			json.put("location", location);
			json.put("gameState", new JSONArray());
			json.put("isGameOver",false);
			json.put("timeGame", 1800);//TODO get this from game

			String response = sendJSON(getGameURL(), "POST", json);

			JSONObject resp = new JSONObject(response);
			id = resp.getString("_id");
		}
		catch(Exception e){
			id = null;
		}

		return id;
	}

	private void updateGameState(String id, GameState state){
		try {
			JSONObject json = createGameStateJSON(state);
			sendJSON(getGameStateURL(id), "POST", json);
		}
		catch(Exception e){
			System.out.println(Messenger.newMessage(Messenger.Type.WARNING, "Unable to send gamestate to replay server"));
			e.printStackTrace();
		}
	}

	private JSONObject createGameStateJSON(GameState state) throws Exception{
		JSONObject json = new JSONObject();

		json.put("corporation",createTeamJSON(state.getTeamA(),state.getTeamAScore()));
		json.put("insurgents",createTeamJSON(state.getTeamB(),state.getTeamBScore()));
		json.put("timeStamp", getDateTimeStamp());
		json.put("capturePoints",createCapturePointsJSON(state.getCapturePoints()));
		json.put("isGameOver",state.isGameOver());

		return json;
	}

	private JSONArray createCapturePointsJSON(Map<String, CapturePoint> capturePoints) throws Exception{
		JSONArray array = new JSONArray();

		capturePoints.forEach(
				(name,capturePoint) -> {

					JSONObject json = new JSONObject();
					json.put("name",name);
					json.put("lat",String.valueOf(capturePoint.getLocationCenter().getLatitude()));
					json.put("lng",String.valueOf(capturePoint.getLocationCenter().getLongitude()));
					json.put("radius",capturePoint.getLocationRadius());
					json.put("energy",capturePoint.getCurrentEnergy());

					if(capturePoint.getTeamOwner()=='A'){
						json.put("teamOwner","Corporation");
					} else if(capturePoint.getTeamOwner()=='B'){
						json.put("teamOwner","Insurgents");
					}
					else{
						json.put("teamOwner",capturePoint.getTeamOwner());
					}

					array.put(json);
				}
		);

		return array;
	}

	private JSONObject createTeamJSON(Team team, int points) throws Exception{
		JSONObject json = new JSONObject();
		JSONArray players = new JSONArray();
		team.getPlayers().forEach(
				(username,player) -> {
					JSONObject playerJSON = new JSONObject();
					playerJSON.put("username",username);
					playerJSON.put("lat",String.valueOf(player.getLocation().getLatitude()));
					playerJSON.put("lng",String.valueOf(player.getLocation().getLongitude()));
					playerJSON.put("role",player.getRole().toCapitalizedString());
					playerJSON.put("energy",player.getEnergy());

					players.put(playerJSON);
				}
		);

		json.put("players",players);
		json.put("points",points);
		if(team.getId() == 'B') {
			json.put("color", "#f2a925");
			json.put("color_name", "Orange");
		}
		else{
			json.put("color", "#af80af");
			json.put("color_name", "Purple");
		}

		return json;
	}

	private String sendJSON(String url, String requestMethod, JSONObject json) throws Exception{
		StringBuilder response = new StringBuilder();
		HttpURLConnection con = null;
		OutputStream os = null;
		BufferedReader br = null;
		try{
			con = (HttpURLConnection) new URL(url).openConnection();
			con.setDoOutput(true);
			con.setRequestMethod(requestMethod);
			con.setRequestProperty("Content-Type", "application/json");

			//System.out.println("ReplayClient Sent: "+json.toString(1));
			os = con.getOutputStream();
			os.write(json.toString().getBytes());
			os.flush();

			System.out.println(Messenger.newMessage(Messenger.Type.SERVICE, "Message sent to replay server"));

			br = new BufferedReader(new InputStreamReader(con.getInputStream()));

			String line;
			while ((line = br.readLine()) != null) {
				response.append(line);
			}
			//System.out.println("ReplayClient Received: "+response.toString());
		}
		finally {
			if(con != null) con.disconnect();

			try{
				if(os != null) os.close();
			}
			catch(Exception e){
				e.printStackTrace();
			}

			try{
				if(br != null) br.close();
			}
			catch(Exception e){
				e.printStackTrace();
			}
		}

		return response.toString();
	}

}
