import { StyleSheet, Image, Platform } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Markdown from 'react-native-markdown-display';



const profile = {
  name: "Guy Fauntleroy",
  position: "Guard",
  height: "6'0\"",
  image: "https://athletics.claflin.edu/images/2024/10/8/Fauntleroy__Guy_HS_2024-25_hW0iH.jpg?width=80&quality=90",
  class: "Jr.",
  hometown: "Upper Marlboro, Maryland",
  high_school: "Olympus Prep"
};

export default function ProfileScreen() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>({});
  const [avgPlayerStats, setAvgPlayerStats] = useState<any>({});
  const [aiTrainingSuggestions, setAiTrainingSuggestions] = useState<any>("");
  const [players, setPlayers] = useState<any[]>([]);
  const [selectedPlayer, setselectedPlayer] = useState<string>("Gregory Spurlock");


  const get_schedule_with_scores = () => {
    let data={"player_name": selectedPlayer};
    
    axios.post('http://localhost:8000/player/get_schedule', data)
    .then((response) => {
      // console.log(response.data); 
      setSchedule(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  const set_player = (player_name: string) => {
    setselectedPlayer(player_name); 
  }


  const get_all_players = () => {
    axios.get('http://localhost:8000/players')
    .then((response) => {
      // console.log(response.data);
      setPlayers(response.data);
    })
    .catch((error) => {
        console.error(error);
      });
    }
  const get_profile = () => {
    let data={"player_name": selectedPlayer};
    axios.post('http://localhost:8000/player', data)
    .then((response) => {
      console.log(response.data);
      response.data.image = "https://athletics.claflin.edu" + response.data.image;
      setProfile(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  const get_player_stats = () => {
    let data={"player_name": selectedPlayer};
    axios.post('http://localhost:8000/player/season_averages', data)
    .then((response) => {
      console.log(response.data);
      setAvgPlayerStats(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  const get_ai_training_suggestions = () => {
    let data={"player_name": selectedPlayer};
    setAiTrainingSuggestions("Loading...");
    axios.post('http://localhost:8000/player/training_recommendations_gpt', data)
    .then((response) => {
      console.log(response.data);
      setAiTrainingSuggestions(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
  }
  
  useEffect(() => {
    get_all_players();
  }
  ,[]);

  useEffect(() => {
    get_profile();
  }
  ,[selectedPlayer]);
  
  useEffect(() => {
    get_schedule_with_scores();
    get_player_stats();
    get_ai_training_suggestions();
  },
  [profile]);

  const display_schedule = () => {
    return schedule.slice(-10).map((game) => {
      let backgroundColor = 'transparent';
      if (game.claflin_score !== null && game.opponent_score !== null) {
        backgroundColor = game.claflin_score > game.opponent_score ? 'rgba(0, 128, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)';
      }
      return (
        <ThemedView style={{ marginBottom:10, padding: 16, backgroundColor, borderRadius: 10, boxShadow: '0 10px 50px 0 rgba(31, 38, 135, 0.35)',backdropFilter: 'blur(4px)',}} key={game.id}>
          <ThemedText style={{ fontSize: 24, fontWeight: 'bold' }}>{game.opponent}</ThemedText>
          <ThemedText style={{ color: '#808080' }}>{game.date}</ThemedText>
          {game.claflin_score !== null && game.opponent_score !== null ? (
            <ThemedText style={{ color: '#808080' }}>{game.opponent_score} - {game.claflin_score}</ThemedText>
          ) : (
            <ThemedText style={{ color: '#808080' }}>Game not played or cancelled</ThemedText>
            )}
            
            {game.BoxScore && (
            <ThemedView style={{ marginTop: 8 }}>
              <ThemedText style={{ fontWeight: 'bold' }}>Box Score:</ThemedText>
              <ThemedView style={[styles.statsTable, { borderWidth: 1, borderColor: '#ccc' }]}>
              <ThemedView style={[styles.statsRow, { backgroundColor: '#f0f0f0' }]}>
                {/* <ThemedText style={styles.statsCell}>Player</ThemedText> */}
                <ThemedText style={styles.statsCell}>Min</ThemedText>
                <ThemedText style={styles.statsCell}>FG</ThemedText>
                <ThemedText style={styles.statsCell}>3PT</ThemedText>
                <ThemedText style={styles.statsCell}>FT</ThemedText>
                <ThemedText style={styles.statsCell}>ORB-DRB</ThemedText>
                <ThemedText style={styles.statsCell}>REB</ThemedText>
                <ThemedText style={styles.statsCell}>AST</ThemedText>
                <ThemedText style={styles.statsCell}>STL</ThemedText>
                <ThemedText style={styles.statsCell}>BLK</ThemedText>
                <ThemedText style={styles.statsCell}>PTS</ThemedText>
              </ThemedView>
              {game.BoxScore.map((player: any, index: number) => (
                <ThemedView key={index} style={styles.statsRow}>
                {/* <ThemedText style={styles.statsCell}>{player.player}</ThemedText> */}
                <ThemedText style={styles.statsCell}>{player.min}</ThemedText>
                <ThemedText style={styles.statsCell}>{player.fg}</ThemedText>
                <ThemedText style={styles.statsCell}>{player.pt3}</ThemedText>
                <ThemedText style={styles.statsCell}>{player.ft}</ThemedText>
                <ThemedText style={styles.statsCell}>{player.orb_drb}</ThemedText>
                <ThemedText style={styles.statsCell}>{player.reb}</ThemedText>
                <ThemedText style={styles.statsCell}>{player.a}</ThemedText>
                <ThemedText style={styles.statsCell}>{player.stl}</ThemedText>
                <ThemedText style={styles.statsCell}>{player.blk}</ThemedText>
                <ThemedText style={styles.statsCell}>{player.pts}</ThemedText>
                </ThemedView>
              ))}
                </ThemedView>
            </ThemedView>
          )}
        </ThemedView>
      );
    });
  }
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#800000', dark: '#300000' }}
      headerImage={
        <Image
         source={require('@/assets/images/convert.webp')}>

        </Image>

      }>
        <ThemedView style={{ padding: 16 }}>
          {players ? (<select onChange={(e) => set_player(e.target.value)} value={selectedPlayer}>
            
            <option value="" disabled>Select a player</option>
            {players.map((player) => (
              <option key={player} value={player}>
                {console.log(player)}
          {player}
              </option>
            ))}
          </select>):(<></>)}
        </ThemedView>
        <ThemedView style={{ padding: 16 ,borderRadius: 10,boxShadow: '0 10px 50px 0 rgba(31, 38, 135, 0.35)',backdropFilter: 'blur(4px)',}}>
          {/* <ThemedText style={{ fontSize: 24, fontWeight: 'bold' }}>Profile</ThemedText> */}
          
          <ThemedView style={styles.titleContainer}>
            <Image
              source={{ uri: profile.image }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <ThemedView>
              <ThemedText style={{ fontSize: 18 }}>{profile.name}</ThemedText>
              <ThemedText style={{ color: '#808080' }}>{profile.position}</ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.bioContainer}>
            <ThemedText style={styles.bioText}>Height: {profile.height}</ThemedText>
            <ThemedText style={styles.bioText}>Class: {profile.class}</ThemedText>
            <ThemedText style={styles.bioText}>Hometown: {profile.hometown}</ThemedText>
            <ThemedText style={styles.bioText}>High School: {profile.high_school}</ThemedText>
          </ThemedView>
          <Collapsible title="Workout Schedule">
            <ThemedText>Monday: 6 AM - 8 AM</ThemedText>
            <ThemedText>Wednesday: 6 AM - 8 AM</ThemedText>
            <ThemedText>Friday: 6 AM - 8 AM</ThemedText>
          </Collapsible>
          <Collapsible title="Game Schedule">
            {display_schedule()}
          </Collapsible>
        </ThemedView>
        <ThemedView style={{ marginTop: 16 ,borderRadius: 10,boxShadow: '0 10px 50px 0 rgba(31, 38, 135, 0.35)',backdropFilter: 'blur(4px)',}}>
            <ThemedText style={{ fontSize: 20, fontWeight: 'bold' }}>Player Stats</ThemedText>
            <ThemedView style={styles.statsTable}>
            <ThemedView style={styles.statsRow}>
              <ThemedText style={styles.statsCell}>Points per Game</ThemedText>
              <ThemedText style={styles.statsCell}>{avgPlayerStats.points}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statsRow}>
              <ThemedText style={styles.statsCell}>Rebounds per Game</ThemedText>
              <ThemedText style={styles.statsCell}>{avgPlayerStats.reb}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statsRow}>
              <ThemedText style={styles.statsCell}>Assists per Game</ThemedText>
              <ThemedText style={styles.statsCell}>{avgPlayerStats.assists}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statsRow}>
              <ThemedText style={styles.statsCell}>Steals per Game</ThemedText>
              <ThemedText style={styles.statsCell}>{avgPlayerStats.steals}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statsRow}>
              <ThemedText style={styles.statsCell}>Blocks per Game</ThemedText>
              <ThemedText style={styles.statsCell}>{avgPlayerStats.blocks}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statsRow}>
              <ThemedText style={styles.statsCell}>Field Goal %</ThemedText>
              <ThemedText style={styles.statsCell}>{avgPlayerStats.fg_pct}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statsRow}>
              <ThemedText style={styles.statsCell}>3-Point %</ThemedText>
              <ThemedText style={styles.statsCell}>{avgPlayerStats['3p_pct']}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statsRow}>
              <ThemedText style={styles.statsCell}>Free Throw %</ThemedText>
              <ThemedText style={styles.statsCell}>{avgPlayerStats.ft_pct}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statsRow}>
              <ThemedText style={styles.statsCell}>Turnovers per Game</ThemedText>
              <ThemedText style={styles.statsCell}>{avgPlayerStats.turnovers}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statsRow}></ThemedView>
              <ThemedText style={styles.statsCell}>Minutes per Game</ThemedText>
              <ThemedText style={styles.statsCell}>{avgPlayerStats.minutes}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statsRow}>
              <ThemedText style={styles.statsCell}>Offensive Rebounds per Game</ThemedText>
              <ThemedText style={styles.statsCell}>{avgPlayerStats.offensive_rebounds}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statsRow}>
              <ThemedText style={styles.statsCell}>Defensive Rebounds per Game</ThemedText>
              <ThemedText style={styles.statsCell}>{avgPlayerStats.defensive_rebounds}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statsRow}>
              <ThemedText style={styles.statsCell}>Personal Fouls per Game</ThemedText>
              <ThemedText style={styles.statsCell}>{avgPlayerStats.personal_fouls}</ThemedText>
            </ThemedView>
            </ThemedView>

            <ThemedView style={{ marginTop: 16 ,borderRadius: 10,boxShadow: '0 10px 50px 0 rgba(31, 38, 135, 0.35)',backdropFilter: 'blur(4px)',}}>
              <ThemedText style={{ fontSize: 20, fontWeight: 'bold' }}>AI Training Recommendations</ThemedText>
              <ThemedText style={{ marginTop: 8 }}><Markdown>{aiTrainingSuggestions}</Markdown></ThemedText>
            </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  bioContainer: {
    marginTop: 16,
  },
  bioText: {
    fontSize: 16,
    marginVertical: 2,
  },
  statsTable: {
    marginTop: 8,
    boxShadow: '0 10px 50px 0 rgba(31, 38, 135, 0.35)',
    backdropFilter: 'blur(4px)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  statsCell: {
    fontSize: 16,
    width: '50%',
    
  },
  container: {
    flex: 1,
    padding: 20,
  },
});
