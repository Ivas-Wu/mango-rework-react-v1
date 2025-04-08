import React, { useEffect, useState } from 'react'
import TileBoard from './TileBoard'
import { Operator, TileProperties, TileState } from './TileModels';
import { TileService } from '../../services/TileService/TileService';
import { TileBroadcastConstants } from '../../constants/EventConstants';

interface TileParentProps {
    tileService: TileService;
    selectedTile: number | null;
    selectedOperator: Operator | null;
    height: number;
    setSelectedTile: (idx: number | null) => void;
    setSelectedOperator: (operator: Operator | null) => void;
}

const TileParent: React.FC<TileParentProps> = ({ tileService, selectedTile, selectedOperator, height, setSelectedTile, setSelectedOperator }) => {
    const [basicTiles, setBasicTiles] = useState<TileProperties[]>([]);
    const [advancedTiles, setAdvancedTiles] = useState<TileProperties[]>([]);

    const [highlightedTiles, setHighlightedTiles] = useState<number[]>([]);

    useEffect(() => {
        tileService.on(TileBroadcastConstants.TILES_UPDATED, (operation: boolean) => {
            setTiles(...tileService.getTiles(), operation);
        });
    }, []);

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
        setBasicTiles([...newBt]);
        setAdvancedTiles([...newAt]);

        if (setSelect && newAt.length > 0) {
            setSelectedTile(newAt[newAt.length - 1].idx);
        }
    };

    const getDynamicStyles = (): React.CSSProperties => {
        return {
            maxHeight: `${height}lvh`
        };
    };

    return (
        <div className={`flex flex-col flex-1 pb-1`} style={getDynamicStyles()}>
            <TileBoard tiles={basicTiles} selectedTile={selectedTile} highlightedTiles={highlightedTiles} onTileClick={clickTile}></TileBoard>
            <TileBoard tiles={advancedTiles} selectedTile={selectedTile} highlightedTiles={highlightedTiles} onTileClick={clickTile}></TileBoard>
        </div>
    )
}

export default TileParent
