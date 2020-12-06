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
    _id?: string;
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
            combo: false,
            options: []
        },
        gender: {
            value: '',
            label: "Gender",
            required: false,
            combo: false,
            options: []
        },
        alignment: {
            value: '',
            label: "Alignment",
            required: false,
            combo: false,
            options: []
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
            combo: false,
            options: []
        },
        factions: {
            value: [],
            label: "Factions",
            required: false,
            combo: false,
            options: []
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
            combo: false,
            options: []
        }
    });
    const [charsByCampaign, setCharsByCampaign] = useState([]);
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

    const createInputs = (fields: {}) => {
        return Object.keys(fields).map((field) => {
            let fieldData: {
                value: string | string[];
                label: string;
                required: boolean;
                combo: boolean;
                options?: string[];
            };
            let jsx;
            if (hasKey(fields, field)) {
                fieldData = fields[field];
                const isArray = Array.isArray(fieldData.value);
                let error: boolean;
                if (field === 'knownAssociates') {
                    //@TODO: Handle input for known associates. Need to add _id to the formData.
                    jsx = (
                        <Autocomplete
                            key={field}
                            freeSolo={!fieldData.combo}
                            id={field}
                            options={charsByCampaign}
                            getOptionLabel={(option: CharFormData) => `${option.firstName} ${option.lastName}`}
                            multiple
                            onChange={(e, val) => {
                                if (val) {
                                    const values = val.map((char) => {
                                        return typeof (char) === 'object' && typeof (char._id) === 'string' ? char._id : '';
                                    });
                                    inputHandler(e, values, field);
                                }
                            }}
                            onBlur={(event) => {
                                const el = event.target as HTMLInputElement;
                                if (el.value.length) {
                                    error = true
                                }
                            }}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index: number) => (
                                    <Chip variant="outlined" label={`${option.firstName} ${option.lastName}`} {...getTagProps({ index })} />
                                ))
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
                } else if (isArray) {
                    jsx = (
                        <Autocomplete
                            key={field}
                            freeSolo={!fieldData.combo}
                            id={field}
                            options={fieldData.options ? fieldData.options : []}
                            multiple
                            onChange={(e, val) => inputHandler(e, val, field)}
                            onBlur={(event) => {
                                const el = event.target as HTMLInputElement;
                                if (el.value.length) {
                                    error = true
                                }
                            }}
                            renderTags={(value: string[], getTagProps) =>
                                value.map((option: string, index: number) => (
                                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                ))
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
                            options={fieldData.options ? fieldData.options : []}
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
        });
    };

    const identityInputs = createInputs({
        firstName: formData.firstName,
        lastName: formData.lastName,
        pronunciation: formData.pronunciation,
        campaigns: formData.campaigns
    });

    const demographicInputs = createInputs({
        race: formData.race,
        gender: formData.gender,
        alignment: formData.alignment
    });

    const roleplayInputs = createInputs({
        appearance: formData.appearance,
        characteristics: formData.characteristics,
        biography: formData.biography
    });

    const logisticsInputs = createInputs({
        knownAssociates: formData.knownAssociates,
        locations: formData.locations,
        factions: formData.factions,
        notableInteractions: formData.notableInteractions
    });

    useEffect(() => {
        fetch('http://localhost:8080/characters/options', {
            headers: {
                'Authorization': `Bearer ${props.token}`
            }
        })
            .then((res) => {
                return res.json();
            })
            .then((response) => {
                const options = response.options;
                for (const optName in options) {
                    if (hasKey(formData, optName)) {
                        setFormData((prevState) => {
                            return {
                                ...prevState,
                                [optName]: {
                                    ...formData[optName],
                                    options: options[optName]
                                }
                            }
                        });
                    }
                }
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        const campaigns = formData.campaigns.value.join(',');
        fetch(`http://localhost:8080/characters?campaigns=${campaigns}`, {
            headers: {
                'Authorization': `Bearer ${props.token}`
            }
        })
            .then((res) => {
                return res.json();
            })
            .then((response) => {
                setCharsByCampaign(response.characters);
            })
            .catch((err) => console.log(err));
    }, [props.token, formData.campaigns.value]);

    return (
        <form onSubmit={(e) => submitHandler(e)}>
            <div>
                <h2>Identity</h2>
                {identityInputs}
            </div>
            <div>
                <h2>Demographics</h2>
                {demographicInputs}
            </div>
            <div>
                <h2>Roleplay Details</h2>
                {roleplayInputs}
            </div>
            <div>
                <h2>Logistics and Associations</h2>
                {logisticsInputs}
            </div>
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