import React, { useState, useEffect } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel
} from '@material-ui/core';

import { CharData } from '../../interfaces';

interface Props {
    token: string;
}

const Characters: React.FC<Props> = ({ token }) => {
    const [allCharacters, setAllCharacters] = useState<CharData[]>([]);
    const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/characters', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                return res.json();
            })
            .then((response) => {
                if (response.characters && response.characters.length) {
                    setAllCharacters(response.characters);
                }
            })
            .catch((err) => console.log(err));
    }, [token]);

    const checkboxHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        let updatedSelectedChars: string[] = [
            ...selectedCharacters
        ];
        const charId = event.target.name;
        if (event.target.checked) {
            updatedSelectedChars.push(charId);
        } else if (!event.target.checked) {
            updatedSelectedChars = updatedSelectedChars.filter((id) => {
                return id !== charId;
            });
        }
        setSelectedCharacters(updatedSelectedChars);
    };

    const characterCards = allCharacters.map((char: CharData) => {
        return (
            <Grid item key={char._id}>
                <Card variant="outlined">
                    <CardContent>
                        <FormControlLabel
                            control={<Checkbox
                                onChange={(e) => checkboxHandler(e)}
                                color="primary"
                                name={char._id} />}
                            label={`${char.firstName} ${char.lastName}`}
                        />
                        <p>{char.pronunciation}</p>
                        <p>
                            {char.locations && char.locations.length ? char.locations[0] : null}
                            {char.locations && char.locations.length && char.factions && char.factions.length ? ' - ' : null}
                            {char.factions && char.factions.length ? char.factions[0] : null}
                        </p>
                    </CardContent>
                </Card>
            </Grid>
        );
    });


    return (
        <div>
            <h1>All Characters</h1>
            { !allCharacters.length ? <p>You don't have any characters yet!</p> : null}
            <Grid container>
                <div>{characterCards}</div>
            </Grid>
        </div>
    );
};

export default Characters;