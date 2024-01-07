import React, { ReactElement } from 'react';
import './Cell.scss';
import { Labels } from '../../../models/Labels';
import { mergeClasses } from '../../../utils/utils';
import CellModel from 'models/CellModel';
import { Letters } from 'models/Letters';

type CellProps = {
    cell: CellModel;
    selected: boolean;
    onCellClick: (cell: CellModel) => void;
};

export const Cell = ({ cell, selected, onCellClick }: CellProps): ReactElement => {
    const handleFigureClick = () => onCellClick(cell);
    return (
        <div className={mergeClasses('cell', cell.label, selected ? 'selected' : '')} onClick={handleFigureClick}>
            {(cell.x === 0 || cell.x === 7) && (
                <div className={mergeClasses('board-border', cell.x === 0 ? 'top' : 'bottom')}>
                    {Letters[cell.y]}
                </div>
            )}

            {(cell.y === 0 || cell.y === 7) && (
                <div className={mergeClasses('board-border', cell.y === 0 ? 'left' : 'right')}>
                    {8 - cell.x}
                </div>
            )}

            {(cell.available && !cell.figure) && (
                <div className='available'/>
            )}

            {(cell.figure != null) && (
                <img 
                    className="icon" 
                    src={cell.figure.imageSrc} 
                    alt={cell.figure.name} 
                />
            )}
        </div>
    );
};