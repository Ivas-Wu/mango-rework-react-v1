import React, { useEffect, useState } from 'react'
import TileBoard from './TileBoard'
import { Operator, TileProperties, TileState } from './TileModels';
import { TileService } from '../../services/TilesService';
import Operators from './Operators';
import { ConfigService } from '../../services/ConfigService';
import { TileBroadcastConstants } from '../../constants/EventConstants';

// const sampleData: TileProperties[] = [
//     { idx: 1, value: 1, highlighted: false, state: TileState.UNUSED, parents: [], children: [] },
//     { idx: 2, value: 2, highlighted: false, state: TileState.UNUSED, parents: [], children: [] }
// ]
interface TileParentProps {
    selectedTile: number | null;
    validCommit: boolean;
    triggerReset: boolean;
    setSelectedTile: (idx: number | null) => void;
    linkTile: () => void;
    clearParentTile: (idx: number) => void;
}

const TileParent: React.FC<TileParentProps> = ({ selectedTile, validCommit, triggerReset, setSelectedTile, linkTile, clearParentTile }) => {
    const [basicTiles, setBasicTiles] = useState<TileProperties[]>([]);
    const [advancedTiles, setAdvancedTiles] = useState<TileProperties[]>([]);

    const [highlightedTiles, setHighlightedTiles] = useState<number[]>([]);
    const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);

    const tileService = TileService.getInstance();
    const configService = ConfigService.getInstance();

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            switch (event.key) {
                case configService.getOperation(0):
                    clickOperator(Operator.ADD);
                    return
                case configService.getOperation(1):
                    clickOperator(Operator.SUBTRACT);
                    return
                case configService.getOperation(2):
                    clickOperator(Operator.MULTIPLY);
                    return
                case configService.getOperation(3):
                    clickOperator(Operator.DIVIDE);
                    return
                default:
                    return
            }
        };

        document.addEventListener("keydown", handleKeyPress);

        tileService.on(TileBroadcastConstants.TIMES_UPDATED, () => {
            setTiles(...tileService.getTiles());
        });

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

    useEffect(() => {
        if (triggerReset) {
            clearSelected();
            setSelectedOperator(null);
            setTiles(...tileService.reset());
            tileService.stopTimer();
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

    const addBasicTiles = () => tileService.addTiles();
    const clearSelected = () => {
        setSelectedTile(null);
        setHighlightedTiles([]);
    };

    const clearTile = () => { // Can only clear an advanced tile or a basic tile linked with children
        if (!selectedTile) return
        tileService.clearTile(selectedTile!);
        clearParentTile(selectedTile!);
        clearSelected();
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
        // if (setSelect) setSelectedTile(newAt[newAt.length - 1].idx)
    };

    const clickOperator = (operator: Operator) => {
        setSelectedOperator((selectedOperator !== operator) ? operator : null);
        clearSelected();
    };

    const commitTile = () => {
        if (!selectedTile) return;
        tileService.setTileUsed(selectedTile);
        setSelectedOperator(null);
        linkTile();
    }

    return (
        <div className='flex flex-col flex-1 pb-1 max-h-full'>
            <TileBoard tiles={basicTiles} selectedTile={selectedTile} highlightedTiles={highlightedTiles} onTileClick={clickTile}></TileBoard>
            <button onClick={() => addBasicTiles()} className='border-solid border-2 rounded-md'>Add</button>
            <button onClick={() => tileService.startTimer()} className='border-solid border-2 rounded-md'>Start Timer</button>
            <button onClick={() => clearTile()} className='border-solid border-2 rounded-md'>Clear</button>
            <button disabled={!validCommit} onClick={() => commitTile()} className='border-solid border-2 rounded-md'>Commit</button>
            <TileBoard tiles={advancedTiles} selectedTile={selectedTile} highlightedTiles={highlightedTiles} onTileClick={clickTile}></TileBoard>
            <div className='flex flex-row'>
                {Object.keys(Operator).map((op) => {
                    const operator = Operator[op as keyof typeof Operator];
                    return (
                        <Operators key={op} operator={operator} selected={selectedOperator === operator} onClick={clickOperator} />
                    );
                })}
            </div>
        </div>
    )
}

export default TileParent
