import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import {IconSymbol} from '@/components/ui/IconSymbol';

const schedule: { [key: string]: Game } = {
    "Millersville University": {
        "opponent": "Millersville University",
        "date": "Nov 9 (Sat)\n5:00 p.m.",
        "away": true,
        "score": "L,\n70-89",
        "box_score_link": "https://athletics.claflin.edu/sports/mens-basketball/stats/2024-25/millersville-university/boxscore/3573"
    },
    "Mansfield University": {
        "opponent": "Mansfield University",
        "date": "Nov 10 (Sun)\n1:00 p.m.",
        "away": false,
        "score": "W,\n87-47",
        "box_score_link": "https://athletics.claflin.edu/sports/mens-basketball/stats/2024-25/mansfield-university/boxscore/3574" 
    },
    "Lincoln Memorial University": {
        "opponent": "Lincoln Memorial University",
        "date": "Nov 13 (Wed)\n7:00 p.m.",
        "away": true,
        "score": "L,\n74-82",
        "box_score_link": "https://athletics.claflin.edu/sports/mens-basketball/stats/2024-25/lincoln-memorial-university/boxscore/3575"
    },
    "University of Tampa": {
        "opponent": "University of Tampa",
        "date": "Nov 16 (Sat)\n4:00 p.m.",
        "away": true,
        "score": "L,\n76-96",
        "box_score_link": "https://athletics.claflin.edu/sports/mens-basketball/stats/2024-25/university-of-tampa/boxscore/3576"  
    },
    "Voorhees College (S.C.)": {
        "opponent": "Voorhees College (S.C.)",
        "date": "Nov 23 (Sat)\n3:30 p.m.",
        "score": "W,\n86-46",
        "box_score_link": "https://athletics.claflin.edu/sports/mens-basketball/stats/2024-25/voorhees-colleges-c-/boxscore/3578" 
    },
    "Lee University (Tenn.)": {
        "opponent": "Lee University (Tenn.)",
        "date": "Nov 26 (Tue)\n5:30 p.m.",
        "score": "L,\n72-74",
        "box_score_link": "https://athletics.claflin.edu/sports/mens-basketball/stats/2024-25/lee-university-tenn-/boxscore/3655" 
    },
    "USC Aiken": {
        "opponent": "USC Aiken",
        "date": "Nov 30 (Sat)\n3:30 p.m.",
        "away": true,
        "score": "W,\n100-94",
        "box_score_link": "https://athletics.claflin.edu/sports/mens-basketball/stats/2024-25/usc-aiken/boxscore/3579"
    },
    "Virginia Union University": {
        "opponent": "Virginia Union University",
        "date": "Dec 5 (Thu)\n7:30 p.m.",
        "away": true,
        "score": "W,\n79-76",
        "box_score_link": "https://athletics.claflin.edu/sports/mens-basketball/stats/2024-25/virginia-union-university/boxscore/3580"
    },
    "Bowie State University": {
        "opponent": "Bowie State University",
        "date": "Dec 7 (Sat)\n3:30 p.m.",
        "away": true,
        "score": "W,\n80-58",
        "box_score_link": "https://athletics.claflin.edu/sports/mens-basketball/stats/2024-25/bowie-state-university/boxscore/3581"
    },
    "Lincoln University (Pa.)": {
        "opponent": "Lincoln University (Pa.)",
        "date": "Dec 9 (Mon)\n7:30 p.m.",
        "away": true,
        "score": "L,\n50-64",
        "box_score_link": "https://athletics.claflin.edu/sports/mens-basketball/stats/2024-25/lincoln-university-pa-/boxscore/3583"
    },
    "Albany State University": {
        "opponent": "Albany State University",
        "date": "Dec 13 (Fri)\n11:15 a.m.",
        "away": false,
        "score": "W,\n79-68",
        "box_score_link": "https://athletics.claflin.edu/sports/mens-basketball/stats/2024-25/albany-state-university/boxscore/3600"
    },
    "Shaw University": {
        "opponent": "Shaw University",
        "date": "Feb 12 (Wed)\n7:30 p.m."
    },
    "University of Fort Lauderdale": {
        "opponent": "University of Fort Lauderdale",
        "date": "Dec 15 (Sun)\n11:00 a.m.",
        "away": false,
        "score": "W,\n104-92",
        "box_score_link": "https://athletics.claflin.edu/sports/mens-basketball/stats/2024-25/university-of-fort-lauderdale/boxscore/3601"
    },
    "Elizabeth City State University": {
        "opponent": "Elizabeth City State University",
        "date": "Dec 19 (Thu)\n5:00 p.m.",
        "score": "W,\n83-69",
        "box_score_link": "https://athletics.claflin.edu/sports/mens-basketball/stats/2024-25/elizabeth-city-state-university/boxscore/3584"
    },
    "Virginia State University": {
        "opponent": "Virginia State University",
        "date": "Dec 21 (Sat)",
        "score": "L,\n70-84",
        "box_score_link": "https://athletics.claflin.edu/sports/mens-basketball/stats/2024-25/virginia-state-university/boxscore/3585"
    },
    "Bluefield State University": {
        "opponent": "Bluefield State University",
        "date": "Jan 4 (Sat)\n4:00 p.m.",
        "away": true,
        "score": "L,\n82-85",
        "box_score_link": "https://athletics.claflin.edu/sports/mens-basketball/stats/2024-25/bluefield-state-university/boxscore/3586"
    },
    "Virginia University of Lynchburg": {
        "opponent": "Virginia University of Lynchburg",
        "date": "Jan 8 (Wed)\n7:30 p.m.",
        "score": "Canceled"
    },
    "Livingstone College": {
        "opponent": "Livingstone College",
        "date": "Feb 5 (Wed)\n7:30 p.m."
    },
    "Winston-Salem State University": {
        "opponent": "Winston-Salem State University",
        "date": "Feb 8 (Sat)\n4:00 p.m."
    },
    "Fayetteville State University": {
        "opponent": "Fayetteville State University",
        "date": "Feb 19 (Wed)\n7:30 p.m.",
        "away": true
    },
    "Benedict College": {
        "opponent": "Benedict College",
        "date": "Jan 29 (Wed)\n7:30 p.m.",
        "away": true
    },
    "Johnson C. Smith University": {
        "opponent": "Johnson C. Smith University",
        "date": "Feb 22 (Sat)\n4:00 p.m."
    }
};

interface Game {
    opponent: string;
    date: string;
    score?: string;
    box_score_link?: string;
    away?: boolean;
}

const GameCard = ({ game }: { game: Game }) => {
    return (
        <View className="game-card" style={style.gameCard}>
            <View style={style.row}>
                <Text style={style.opponent}>{game.opponent}</Text>
                <Text style={style.date}>{game.date}</Text>
                <Text style={style.score}>{game.score}</Text>
                {game.box_score_link ? (
                    <Text style={style.link} onPress={() => game.box_score_link && Linking.openURL(game.box_score_link)}>Box Score</Text>
                ):(<Text style={style.link}></Text>)}
            
            </View>
        </View>
    );
};

const style = StyleSheet.create({
    gameCard: {
        padding: 10,
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    opponent: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 2,
    },
    date: {
        fontSize: 16,
        color: '#666',
        flex: 1,
    },
    score: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    link: {
        fontSize: 16,
        color: '#1e90ff',
        textDecorationLine: 'underline',
        flex: 1,
    },
    headerImage: {
        marginTop: 20,
    },
});

const Schedule = () => {
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#800000', dark: '#300000' }}
            headerImage={
            <IconSymbol
                size={100}
                color="#808080"
                name="chevron.left.forwardslash.chevron.right"
                style={style.headerImage}
            />
            }>
            <ScrollView className="schedule">
            {Object.keys(schedule).map((key) => (
                <GameCard key={key} game={schedule[key]} />
            ))}
            </ScrollView>
        </ParallaxScrollView>
    );
};

export default Schedule;