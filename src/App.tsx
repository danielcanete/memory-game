import { useState } from 'react';

interface Card {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const cardImages = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊'];
const RANDOM_MIDPOINT = 0.5; 
const randomSort = () => Math.random() - RANDOM_MIDPOINT; 
const INITIAL_MATCHED_PAIRS = 0; 
const INCREMENT = 1; 
const MAX_SELECTED_CARDS = 2; 

function App() {
  const createDeck = (): Card[] => {
    const deck = [...cardImages, ...cardImages] 
      .sort(randomSort) 
      .map((card, index) => ({ 
        id: index,
        image: card,
        isFlipped: false, 
        isMatched: false 
      }));
    return deck;
  };

  const [cards, setCards] = useState<Card[]>(createDeck()); 
  const [selectedCards, setSelectedCards] = useState<Card[]>([]); 
  const [matchedPairs, setMatchedPairs] = useState<number>(INITIAL_MATCHED_PAIRS);

  const handleCardClick = (clickedCard: Card) => {
    
    if (clickedCard.isMatched || clickedCard.isFlipped || selectedCards.length === MAX_SELECTED_CARDS) return;

    
    const newCards = cards.map(card =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    
    const newSelectedCards = [...selectedCards, clickedCard];
    setSelectedCards(newSelectedCards);

    
    if (newSelectedCards.length === MAX_SELECTED_CARDS) {
      setTimeout(() => checkMatch(newSelectedCards, newCards), 1000);
    }
  };

  const checkMatch = (selectedPair: Card[], currentCards: Card[]) => {
    const [first, second] = selectedPair;
    
    if (first.image === second.image) {
      const matchedCards = currentCards.map(card =>
        card.id === first.id || card.id === second.id
          ? { ...card, isMatched: true }
          : card
      );
      
      setCards(matchedCards);
      setMatchedPairs(matchedPairs + INCREMENT);
    } else {
      const resetCards = currentCards.map(card =>
        card.id === first.id || card.id === second.id
          ? { ...card, isFlipped: false }
          : card
      );
      
      setCards(resetCards);
    }

    setSelectedCards([]);
  };

  const resetGame = () => {
    setCards(createDeck());
    setSelectedCards([]);
    setMatchedPairs(INITIAL_MATCHED_PAIRS);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Memory game</h1>
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={`
              w-20 h-20 flex items-center justify-center 
              text-4xl cursor-pointer border-2 rounded-lg
              ${card.isFlipped || card.isMatched ? 'bg-blue-200' : 'bg-blue-500'}
              ${card.isMatched ? 'opacity-50' : ''}
            `}
          >
            {(card.isFlipped || card.isMatched) ? card.image : '?'}
          </div>
        ))}
      </div>
      {matchedPairs === 6 && (
        <div className="my-4 text-green-600 font-bold">
          You won! 🎉
        </div>
      )}
      <button
        onClick={resetGame}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Reset game
      </button>
    </div>
  );
}

export default App
