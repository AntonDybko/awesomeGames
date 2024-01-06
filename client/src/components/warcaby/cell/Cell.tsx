import React, { ReactElement } from 'react';
import './Cell.scss';
import { Labels } from '../../../models/Labels';
import { mergeClasses } from '../../../utils/utils';
import { Color } from 'models/Color';

type CellProps = {
    label: Labels;
    player: Color;
};

export const Cell = ({ label, player }: CellProps): ReactElement => {
    return <div className={mergeClasses('cell', label, player)}></div>;
};