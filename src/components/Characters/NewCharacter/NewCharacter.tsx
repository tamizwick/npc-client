import React from 'react';

import CharacterForm from '../CharacterForm/CharacterForm';

interface Props {
    token: string;
}

const NewCharacter = (props: Props) => {
    return (
        <CharacterForm token={props.token} />
    );
};

export default NewCharacter;