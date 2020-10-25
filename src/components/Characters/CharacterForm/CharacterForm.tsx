import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import {
    TextField,
    Button,
    Chip
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';

interface Props {
    token: string;
}

interface CharFormData {
    firstName: string;
    lastName: string;
    pronunciation: string;
    race: string[];
    gender: string;
    alignment: string;
    appearance: string;
    knownAssociates: string[];
    locations: string[];
    factions: string[]
    characteristics: string[];
    biography: string;
    notableInteractions: string[];
    campaigns: string[];
}

const CharacterForm = (props: Props) => {
    const [formData, setFormData] = useState({
        firstName: {
            value: '',
            label: 'First Name',
            required: true,
            combo: false
        },
        lastName: {
            value: '',
            label: "Last Name",
            required: false,
            combo: false
        },
        pronunciation: {
            value: '',
            label: "Pronunciation",
            required: false,
            combo: false
        },
        race: {
            value: [],
            label: "Race",
            required: false,
            combo: false
        },
        gender: {
            value: '',
            label: "Gender",
            required: false,
            combo: false
        },
        alignment: {
            value: '',
            label: "Alignment",
            required: false,
            combo: false
        },
        appearance: {
            value: '',
            label: "Appearance",
            required: false,
            combo: false
        },
        knownAssociates: {
            value: [],
            label: "Known Associates",
            required: false,
            combo: true
        },
        locations: {
            value: [],
            label: "Locations",
            required: false,
            combo: false
        },
        factions: {
            value: [],
            label: "Factions",
            required: false,
            combo: false
        },
        characteristics: {
            value: [],
            label: "Characteristics",
            required: false,
            combo: false
        },
        biography: {
            value: '',
            label: "Biography",
            required: false,
            combo: false
        },
        notableInteractions: {
            value: [],
            label: "Notable Interactions",
            required: false,
            combo: false
        },
        campaigns: {
            value: [],
            label: "Campaigns",
            required: false,
            combo: false
        }
    });
    const [options, setOptions] = useState({
        firstName: [],
        lastName: [],
        pronunciation: [],
        race: [],
        gender: [],
        alignment: [],
        appearance: [],
        knownAssociates: [],
        locations: [],
        factions: [],
        characteristics: [],
        biography: [],
        notableInteractions: [],
        campaigns: []
    });
    const history = useHistory();

    const inputHandler = (event: React.ChangeEvent<{}>, val: string | string[], field: string) => {
        if (hasKey(formData, field)) {
            const updatedField = {
                ...formData[field],
                value: val
            };
            setFormData({
                ...formData,
                [field]: updatedField
            });
        }
    };

    const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let data = {} as CharFormData;
        for (let field in formData) {
            if (hasKey(formData, field)) {
                data[field] = formData[field].value as string & string[];
            }
        }
        console.log(data);
        fetch('http://localhost:8080/characters/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${props.token}`
            },
            body: JSON.stringify(data)
        })
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                history.push('/characters');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const inputs = Object.keys(formData).map((field) => {
        let fieldData: {
            value: string | string[];
            label: string;
            required: boolean;
        };
        let jsx;
        if (hasKey(formData, field)) {
            fieldData = formData[field];
            const isArray = Array.isArray(fieldData.value);
            let error: boolean;
            if (isArray) {
                jsx = (
                    <Autocomplete
                        key={field}
                        freeSolo={!formData[field].combo}
                        id={field}
                        options={options[field]}
                        multiple
                        onChange={(e, val) => inputHandler(e, val, field)}
                        onBlur={(event) => {
                            const el = event.target as HTMLInputElement;
                            if (el.value.length) {
                                error = true
                            }
                        }}
                        renderTags={(value: string[], getTagProps) => {
                            return value.map((option: string, index: number) => (
                                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                            ));
                        }
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={fieldData.label}
                                required={fieldData.required}
                                error={error}
                                name={field} />
                        )} />
                );
            } else {
                jsx = (
                    <Autocomplete
                        key={field}
                        freeSolo
                        id={field}
                        options={options[field]}
                        onInputChange={(e, val) => inputHandler(e, val, field)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={fieldData.label}
                                required={fieldData.required}
                                name={field} />
                        )} />
                );
            }
        }
        return jsx;
    })

    useEffect(() => {
        //@TODO: Dynamically get options.
        //@TODO: Known associates needs to be a character ID.
    }, []);

    return (
        <form onSubmit={(e) => submitHandler(e)}>
            {inputs}
            <Button
                color="primary"
                variant="contained"
                type="submit">
                <AddBoxOutlinedIcon />
                Add Character
            </Button>
        </form>
    );
};

function hasKey<O>(obj: O, key: keyof any): key is keyof O {
    return key in obj
}

export default CharacterForm;