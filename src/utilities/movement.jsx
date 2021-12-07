import { board } from './board';

export const movement = {
    slope: (newState) => {
            let targetColIndex = board.columns.indexOf(newState.target.coordinates.column);
            let activeColIndex = board.columns.indexOf(newState.active.coordinates.column);

            return (newState.target.coordinates.row - newState.active.coordinates.row)
                    / 
                    (targetColIndex - activeColIndex);
        },

    checkForObstacles: (newState) => {
        let targetColIndex = board.columns.indexOf(newState.target.coordinates.column);
        let activeColIndex = board.columns.indexOf(newState.active.coordinates.column);

        let targetRow = newState.target.coordinates.row;
        let activeRow = newState.active.coordinates.row;
        let rowIndex = board.rows.indexOf(activeRow);
        if (targetRow - activeRow > 0){
             //if we're traveling right
             if(targetColIndex - activeColIndex > 0){
                 // row and column increment
                 for(let i = 1; i < (targetColIndex - activeColIndex); i++){
                     let thisRow = parseInt(board.rows[rowIndex +i]);
                     let thisCol = board.columns[activeColIndex +i];
                     if(newState.currentBoard[thisCol][thisRow]) return false;
                 }
            }
            else {
                console.log('traveling up and left...');
                // row increments, column decrements
                for(let i = 1; i < Math.abs(targetColIndex - activeColIndex); i++){
                    let thisRow = parseInt(board.rows[rowIndex +i]);
                    let thisCol = board.columns[activeColIndex -i];
                    //get the coordinates of i square.
                    console.log(' rowIndex: ', (rowIndex),i, 'current col: ', thisCol);
                    console.log('this square: ', newState.currentBoard[thisCol][thisRow]);
                    if(newState.currentBoard[thisCol][thisRow]) return false;
                }
            }
        }

        // else, if we're traveling down,
        else {
            //if we're traveling left,
            if(targetColIndex - activeColIndex > 1){
                // row decrements, column increments 
                for(let i = 1; i < (targetColIndex - activeColIndex); i++){
                    let thisRow = board.rows[rowIndex-i];
                    let thisCol = board.columns[activeColIndex +i];
                    //get the coordinates of i square.
                    if(newState.currentBoard[thisCol][thisRow]) return false;
                }
                
            } else {
                // row and column decrement
                for(let i = 1; i < (targetColIndex - activeColIndex); i++){
                    let thisRow = board.rows[rowIndex-i];
                    let thisCol = board.columns[activeColIndex -i];
                    //get the coordinates of i square.
                    if(newState.currentBoard[thisCol][thisRow]) return false;
                }
            
                
            }
        }
        return true;
    },
    K: (newState) => {
        return (
            Math.abs(newState.target.Coordinates.column - newState.active.coordinates.column) <= 1
            && Math.abs(newState.target.coordinates.row - newState.active.coordinates.row) <= 1
                );
    },

    Q: (newState) => {
        return ( movement.B(newState) || movement.R(newState) );
    },

    B: (newState) => {
        if (Math.abs( movement.slope(newState) ) !== 1 ) return false;
        return movement.checkForObstacles(newState);
    },

    N: (newState) => {
        console.log('checking N rules... slope = ', movement.slope(newState));
        return (Math.abs( movement.slope(newState) ) === 2 
                || Math.abs( movement.slope(newState) ) === 1/2);
    },

    R: (newState) => {
        if( newState.active.coordinates.column === newState.target.coordinates.column && newState.active.coordinates.row === newState.target.coordinates.row) return false;
        return (movement.slope(newState) === 0);
    },

    P: (newState) => {
        if(newState.target.piece !== null) {
           if(newState.active.piece.substring(0,1) === 'W') {
               return( 
                newState.target.coordinates.row === newState.active.coordinates.row+1 
                && Math.abs(newState.target.coordinates.column - newState.active.coordinates.column) === 1
                );
               }
            else {
                return( 
                newState.target.coordinates.row === newState.active.coordinates.row-1 
                && Math.abs(newState.target.coordinates.column - newState.active.coordinates.column) === 1
                );

            }
        } 
        else if(newState.active.square === newState.active.startSquare) {
            console.log('plus 2 is allowed...');
            if(newState.active.piece.substring(0,1) === 'W') {
               console.log('checking rules for white...')
               console.log(newState.target.coordinates.row, newState.active.coordinates.row+2);
               return( 
                   (
                    newState.target.coordinates.row === newState.active.coordinates.row+1
                    ||
                    newState.target.coordinates.row === newState.active.coordinates.row+2
                    ) 
                    && newState.target.coordinates.column === newState.active.coordinates.column
                   );
           }
           else {
                return( 
                   (
                    newState.target.coordinates.row === newState.active.coordinates.row-1
                    ||
                    newState.target.coordinates.row === newState.active.coordinates.row-2
                    ) 
                    && newState.target.coordinates.column === newState.active.coordinates.column
                   );
           }

        }
        else {
           if(newState.active.piece.substring(0,1) === 'W') {
               return( 
                   newState.target.coordinates.row === newState.active.coordinates.row+1 
                   && newState.target.coordinates.column === newState.active.coordinates.column
                   );
           }
           else {
               return( 
                   newState.target.coordinates.row === newState.active.coordinates.row-1 
                   && newState.target.coordinates.column === newState.active.coordinates.column
                   );
           }
        };
    },

}