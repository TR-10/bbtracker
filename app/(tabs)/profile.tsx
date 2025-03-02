import { StyleSheet, Image, Platform, View, ScrollView, Pressable } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Markdown from 'react-native-markdown-display';
import Calendar from 'react-calendar';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];


export default function ProfileScreen() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>({});
  const [avgPlayerStats, setAvgPlayerStats] = useState<any>({});
  const [aiTrainingSuggestions, setAiTrainingSuggestions] = useState<any>("");
  const [players, setPlayers] = useState<any[]>([]);
  const [selectedPlayer, setselectedPlayer] = useState<string>("Gregory Spurlock");
  const [value, onChange] = useState<Value>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dayDrillSchedule, setDayDrillSchedule] = useState<any[]>([]);
  const [drills, setDrills] = useState<any[]>([]);
  const [selectingDrill, setSelectingDrill] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number>(0);
  const [recommededDrills, setRecommendedDrills] = useState<any[]>([]);
  


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

  const get_drills = () => {
    axios.get('http://localhost:8000/drills')
    .then((response) => {
      console.log("drills",response.data);
      setDrills(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
  }
  const removeDrillFromSchedule = (drill: any) => {
    let data={"player_name": selectedPlayer, "drill": drill.drill_name, "hour": drill.hour, "date": selectedDate};
    axios.delete('http://localhost:8000/player/drill_schedule', {data})
    .then((response) => {
      console.log(response.data);
      get_day_drill_schedule();
    })
    .catch((error) => {
      console.error(error);
    });
  };
  const addDrillToSchedule = (drill: any) => {
    let data={"player_name": selectedPlayer, "drill": drill.name, "hour": selectedHour, "date": selectedDate};
    axios.put('http://localhost:8000/player/drill_schedule', data)
    .then((response) => {
      console.log(response.data);
      get_day_drill_schedule();
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
  const get_day_drill_schedule = () => {
    let data={"player_name": selectedPlayer, "date": selectedDate, "hour": selectedHour};
    axios.post('http://localhost:8000/player/drill_schedule', data)
    .then((response) => {
      console.log("schedule day",data);
      console.log("schedule day",response.data);
      setDayDrillSchedule(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
  };
  const get_ai_training_suggestions = () => {
    let data={"player_name": selectedPlayer};
    setAiTrainingSuggestions("Loading...");
    setRecommendedDrills([]);
    axios.post('http://localhost:8000/player/training_recommendations_gpt', data)
    .then((response) => {
      // console.log(response.data);
      setAiTrainingSuggestions(response.data);
      setRecommendedDrills(response.data.recommended_drills);
    })
    .catch((error) => {
      console.error(error);
    });
  }
  
  useEffect(() => {
    get_all_players();
    onChange(new Date());
    get_drills();
    
  }
  ,[]);

  useEffect(() => {
    get_profile();
  }
  ,[selectedPlayer]);

  useEffect(() => {
    get_day_drill_schedule();
  }
  ,[selectedDate, selectedHour]);
  
  useEffect(() => {
    get_schedule_with_scores();
    get_player_stats();
    get_ai_training_suggestions();
  },
  [profile]);

  const drill_hour_press = (hour: number) => {
    setSelectedHour(hour);
    setDayDrillSchedule([]);
    get_day_drill_schedule()
    setSelectingDrill(true)
    
    
  };

  const display_day_drill_selection_modal = () => {
    return (

      <ThemedView style={{ padding: 16, borderRadius: 10, boxShadow: '0 10px 50px 0 rgba(31, 38, 135, 0.35)', backdropFilter: 'blur(4px)', }}>
      <ThemedText style={{ fontSize: 24, fontWeight: 'bold' }}>Drill Selection</ThemedText>
      <ThemedText style={{ fontSize: 24, fontWeight: 'bold' }}>{selectedHour}:00</ThemedText>
      <ThemedView style={{ flexDirection: 'row', flex: 1 }}>
        <ThemedView style={{ flex: 1 }}>
        <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>Drills</ThemedText>
        <ThemedView style={{ maxHeight: 200, overflow: 'scroll' }}>
          {drills.map((drill) => (
          <ThemedView key={drill.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4 }}>
            <ThemedText>{drill.name}</ThemedText>
            <Pressable 
              style={{ 
              marginLeft: 8, 
              padding: 8, 
              backgroundColor: recommededDrills.includes(drill.name) ? 'rgba(0, 0, 255, 0.2)' : 'rgba(0, 128, 0, 0.2)', 
              borderRadius: 5 
              }} 
              onPress={() => addDrillToSchedule(drill)}
            >
              <ThemedText>
              {recommededDrills?.includes(drill.name) ? 'Add (Recommended)' : 'Add'}
              </ThemedText>
              {recommededDrills?.includes(drill.name) && (
              <IconSymbol name="star" color="blue" size={16} />
              )}
            </Pressable>
          </ThemedView>
          ))}
        </ThemedView>
        </ThemedView>
        <ThemedView style={{ flex: 1 }}>
        <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>Selected Drills</ThemedText>
        <ThemedView style={{ maxHeight: 200, overflow: 'scroll' }}>
          {dayDrillSchedule.map((drill) => (
          <ThemedView key={drill.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4 }}>
            <ThemedText>{drill.drill_name} at {drill.hour}:00</ThemedText>
            <Pressable style={{ marginLeft: 8, padding: 8, backgroundColor: 'rgba(255, 0, 0, 0.2)', borderRadius: 5 }} onPress={() => removeDrillFromSchedule(drill)}>
            <ThemedText>Remove</ThemedText>
            </Pressable>
          </ThemedView>
          ))}
        </ThemedView>
        </ThemedView>
      </ThemedView>
      <Pressable style={{ marginTop: 16, padding: 8, backgroundColor: 'rgba(181, 0, 0, 0.8)', borderRadius: 5}} onPress={() => setSelectingDrill(!selectingDrill)}>
        <ThemedText style={{textAlign: "center"}}>Close</ThemedText>
      </Pressable>
      </ThemedView>
    );
  };

  const display_day_drill_schedule = () => {
    
    return (
      
      <ThemedView style={{ padding: 16, borderRadius: 10, boxShadow: '0 10px 50px 0 rgba(31, 38, 135, 0.35)', backdropFilter: 'blur(4px)', }}>
        <ThemedText style={{ fontSize: 24, fontWeight: 'bold' }}>Drill Schedule</ThemedText>
        <ScrollView style={{ maxHeight: 200 }}>
        <View style={{ flexDirection: 'column', flex: 16 }}>
            {Array.from({ length: 16 }, (_, index) => {
            const hour = index + 6; // Start from 6 AM to 9 PM
            return (
              <View key={hour} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4 , flex:1}}>
              <ThemedText style={{ width: 50 }}>{`${hour}:00`}</ThemedText>
              <Pressable style={{ flex: 1, height: 20, backgroundColor:'rgba(0, 128, 0, 0.2)'  }} onPress={() => drill_hour_press(hour)}>

              </Pressable>

              </View>
            );
            })}
        </View>
        </ScrollView>
      </ThemedView>
    );
  };

  const display_week = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate((selectedDate || value)?.getDate() - (selectedDate || value)?.getDay());

    const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });

    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {daysOfWeek.map((date, index) => (
            <Pressable
            key={index}
            style={{
              flex: 1,
              padding: 16,
              margin: 4,
              borderRadius: 10,
              backgroundColor: date.toDateString() === selectedDate.toDateString() ? 'rgba(0, 128, 0, 0.2)' : 'transparent',
              boxShadow: '0 10px 50px 0 rgba(31, 38, 135, 0.35)',
              backdropFilter: 'blur(4px)',
            }}
            onPress={() => setSelectedDate(date)}
            >
            <ThemedText style={{ textAlign: 'center' }}>{date.toDateString()}</ThemedText>
            </Pressable>
        ))}
        
      </View>
    );
  }
useEffect(() => {
  setSelectedDate(value as Date);
}, [value]);

  const display_schedule = () => {
    return schedule.map((game) => {
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

  const show_stats = () => {
    return(
    
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
    );
  }

  const show_bio = () => {
    return (
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
        </ThemedView>
    )
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
          {player}
              </option>
            ))}
          </select>):(<></>)}
        </ThemedView>
        {show_bio()}
        <ScrollView style={{ maxHeight: 300 }}>
        <ThemedView style={{ marginTop: 16 ,borderRadius: 10,boxShadow: '0 10px 50px 0 rgba(31, 38, 135, 0.35)',backdropFilter: 'blur(4px)',}}>
              <ThemedText style={{ fontSize: 20, fontWeight: 'bold' }}>AI Training Recommendations</ThemedText>
              <ThemedText style={{ marginTop: 8 }}><Markdown>{aiTrainingSuggestions.recommendations}</Markdown></ThemedText>
            </ThemedView>
            </ScrollView>
        <View style={{ flex: 2, flexDirection: 'row' }}>
          {/* Workout calendar */}
          <ThemedView style={{overflow: 'scroll' , padding: 16, borderRadius: 10, boxShadow: '0 10px 50px 0 rgba(31, 38, 135, 0.35)', backdropFilter: 'blur(4px)', flex: 1, marginRight: 8 }}>
            {/* <Collapsible title="Workout Calendar"> */}
            <Calendar 
              onChange={onChange} 
              value={value} 
              tileClassName={({ date, view }) => {
              if (value instanceof Date && date.toDateString() === value.toDateString()) {
                return 'selected';
              }
              return null;
              }}
            />
            {display_week()}
            {display_day_drill_schedule()}
            {/* </Collapsible> */}
          </ThemedView>

          {/* Games Schedule and box score */}
          <ThemedView style={{ padding: 16, borderRadius: 10, boxShadow: '0 10px 50px 0 rgba(31, 38, 135, 0.35)', backdropFilter: 'blur(4px)', flex: 1, marginLeft: 8 }}>
            {/* <Collapsible title="Game Schedule"> */}
              <ScrollView style={{ maxHeight: 500 }}>
          {display_schedule()}
              </ScrollView>
            {/* </Collapsible> */}
          </ThemedView>
        </View>
        <ThemedView style={{ marginTop: 16 ,borderRadius: 10,boxShadow: '0 10px 50px 0 rgba(31, 38, 135, 0.35)',backdropFilter: 'blur(4px)',}}>
        {selectingDrill && display_day_drill_selection_modal()}
        </ThemedView>
        {show_stats()}

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
