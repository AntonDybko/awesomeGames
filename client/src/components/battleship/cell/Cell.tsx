import { ReactElement } from 'react';
import './Cell.scss';
import { mergeClasses } from '../../../utils/utils';
import CellModel from 'models/statki/CellModel';

type CellProps = {
    cell: CellModel;
    onCellClick: (cell: CellModel) => void;
};

export const Cell = ({ cell, onCellClick }: CellProps): ReactElement => {
    const handleClick = () => onCellClick(cell);
    return (
        <div className={mergeClasses('cell', (cell.ship !== null && !cell.hidden) ? 'ship' : '')} onClick={handleClick}>
            {(cell.hidden) && (
                <div className='hidden'/>
            )}

            {cell.miss === true && <div className="miss" />}

            {(cell.ship?.destroyed) && (
                <img 
                    className="icon" 
                    src={cell.ship?.imageSrc}
                    alt='destroyedShip'
                />
            )}
        </div>
    );
};