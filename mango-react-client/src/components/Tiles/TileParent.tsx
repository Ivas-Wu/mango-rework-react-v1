import React, { useEffect, useState } from 'react'
import TileBoard from './TileBoard'
import { Operator, TileProperties, TileState } from './TileModels';
import { TileService } from '../../services/TilesService';
import Operators from './Operators';

// const sampleData: TileProperties[] = [
//     { idx: 1, value: 1, highlighted: false, state: TileState.UNUSED, parents: [], children: [] },
//     { idx: 2, value: 2, highlighted: false, state: TileState.UNUSED, parents: [], children: [] }
// ]
interface TileParentProps {
    selectedTile: number | null;
    validCommit: boolean;
    setSelectedTile: (idx: number | null) => void;
    linkTile: () => void;
}

const TileParent: React.FC<TileParentProps> = ({ selectedTile, validCommit, setSelectedTile, linkTile }) => {
    const [basicTiles, setBasicTiles] = useState<TileProperties[]>([]);
    const [advancedTiles, setAdvancedTiles] = useState<TileProperties[]>([]);

    const [highlightedTiles, setHighlightedTiles] = useState<number[]>([]);
    const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);

    const tileService = TileService.getInstance();

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
    
    const addBasicTiles = () => setTiles(...tileService.addTiles());
    const clearSelected = () => {
        setSelectedTile(null);
        setHighlightedTiles([]);
    };

    const clearTile = () => { // Can only clear an advanced tile or a basic tile linked with children
        if (!selectedTile) return
        setTiles(...tileService.clearTile(selectedTile!));
        clearSelected();
    };

    const clickTile = (idx: number) => {
        if (selectedOperator && selectedTile) { // Triggers when selecting second element always
            try {
                setTiles(...tileService.basicOperation(selectedTile, idx, selectedOperator!), true);
            }
            catch {
                clearSelected();
            }
        }
        else {
            setSelectedTile(idx);
        }
    };

    const setTiles = (newBt: TileProperties[], newAt: TileProperties[], setSelect = false) => {
        setBasicTiles(newBt);
        setAdvancedTiles(newAt);
        if (setSelect) setSelectedTile(newAt[newAt.length - 1].idx)
    };

    const clickOperator = (operator: Operator) => {
        setSelectedOperator((selectedOperator !== operator) ? operator : null);
        clearSelected();
    };

    const commitTile = () => {
        if (!selectedTile) return;
        setTiles(...tileService.setTileUsed(selectedTile));
        setSelectedOperator(null);
        linkTile();
    }

    return (
        <div className='flex flex-col max-h-screen p-4'>
            <TileBoard tiles={basicTiles} selectedTile={selectedTile} highlightedTiles={highlightedTiles} onTileClick={clickTile}></TileBoard>
            <div className='flex flex-row'>
                {Object.keys(Operator).map((op) => {
                    const operator = Operator[op as keyof typeof Operator];
                    return (
                        <Operators key={op} operator={operator} selected={selectedOperator === operator} onClick={clickOperator} />
                    );
                })}
            </div>
            <button onClick={() => addBasicTiles()} className='border-solid border-2 rounded-md'>Add</button>
            <button onClick={() => clearTile()} className='border-solid border-2 rounded-md'>Clear</button>
            <button disabled={!validCommit} onClick={() => commitTile()} className='border-solid border-2 rounded-md'>Commit</button>
            <TileBoard tiles={advancedTiles} selectedTile={selectedTile} highlightedTiles={highlightedTiles} onTileClick={clickTile}></TileBoard>
        </div>
    )
}

export default TileParent
