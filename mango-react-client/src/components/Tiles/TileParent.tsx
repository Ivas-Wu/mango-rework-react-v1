import React, { useEffect, useState } from 'react'
import TileBoard from './TileBoard'
import { Operator, TileProperties, TileState } from './TileModels';
import { TileService } from '../../services/TilesService';
import { TileBroadcastConstants } from '../../constants/EventConstants';

export enum TileTriggerMode {
    NONE = 0,
    CLEAR_SELECTED = 1,
    RESET_ALL = 2,
}

interface TileParentProps {
    selectedTile: number | null;
    triggerReset: TileTriggerMode;
    selectedOperator: Operator | null;
    setSelectedTile: (idx: number | null) => void;
    resetComplete: () => void;
    setSelectedOperator: (operator: Operator | null) => void;
}

const TileParent: React.FC<TileParentProps> = ({ selectedTile, triggerReset, selectedOperator, setSelectedTile, resetComplete, setSelectedOperator }) => {
    const [basicTiles, setBasicTiles] = useState<TileProperties[]>([]);
    const [advancedTiles, setAdvancedTiles] = useState<TileProperties[]>([]);

    const [highlightedTiles, setHighlightedTiles] = useState<number[]>([]);

    const tileService = TileService.getInstance();

    useEffect(() => {
        tileService.on(TileBroadcastConstants.TIMES_UPDATED, (operation: boolean) => {
            setTiles(...tileService.getTiles(), operation);
        });
    }, []);

    useEffect(() => {
        if (triggerReset === TileTriggerMode.RESET_ALL) {
            clearSelected();
            setSelectedOperator(null);
            tileService.reset();
            resetComplete();            
        }
        else if (triggerReset === TileTriggerMode.CLEAR_SELECTED) {
            clearSelected();
            resetComplete();  
        }
    }, [triggerReset]);

    useEffect(() => {
        if (selectedTile != null) {
            setHighlightedTiles(tileService.findAllAssociated(selectedTile));
            if (tileService.getTileFromIdx(selectedTile).state === TileState.USED) {
                setSelectedOperator(null);
            }
        }
        else {
            setHighlightedTiles([]);
        }
    }, [selectedTile]);

    const clearSelected = () => {
        setSelectedTile(null);
        setHighlightedTiles([]);
    };

    const clickTile = (idx: number) => {
        if (selectedOperator && selectedTile && selectedTile !== idx) { // Triggers when selecting second element always
            try {
                tileService.basicOperation(selectedTile, idx, selectedOperator!);
            }
            catch {
                clearSelected();
            }
        }
        else {
            setSelectedTile(idx === selectedTile ? null : idx);
        }
    };

    const setTiles = (newBt: TileProperties[], newAt: TileProperties[], setSelect = false) => {
        setBasicTiles(newBt);
        setAdvancedTiles(newAt);
        if (setSelect) setSelectedTile(newAt[newAt.length - 1].idx)
    };

    return (
        <div className='flex flex-col flex-1 pb-1 max-h-full'>
            <TileBoard tiles={basicTiles} selectedTile={selectedTile} highlightedTiles={highlightedTiles} onTileClick={clickTile}></TileBoard>
            <TileBoard tiles={advancedTiles} selectedTile={selectedTile} highlightedTiles={highlightedTiles} onTileClick={clickTile}></TileBoard>
        </div>
    )
}

export default TileParent
