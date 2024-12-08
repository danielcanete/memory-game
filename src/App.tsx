import { useState } from 'react';

interface Card {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const cardImages = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊'];
const RANDOM_MIDPOINT = 0.5; // Punto medio para mezclar las cartas
const randomSort = () => Math.random() - RANDOM_MIDPOINT; // Función para mezclar las cartas
const INITIAL_MATCHED_PAIRS = 0; // Pares iniciales encontrados
const INCREMENT = 1; // Incremento para el contador de pares encontrados
const MAX_SELECTED_CARDS = 2; // Máximo de cartas seleccionadas

function App() {

  const createDeck = (): Card[] => {
    const deck = [...cardImages, ...cardImages] // Duplicamos las cartas
      .sort(randomSort) // Las mezclamos
      .map((card, index) => ({ // Creamos un objeto para cada carta
        id: index,
        image: card,
        isFlipped: false, // Si la carta está boca arriba
        isMatched: false // Si la carta ya fue encontrada
      }));
    return deck;
  };

  const [cards, setCards] = useState<Card[]>(createDeck()); // Creamos el mazo de cartas
  const [selectedCards, setSelectedCards] = useState<Card[]>([]); // Cartas seleccionadas
  const [matchedPairs, setMatchedPairs] = useState<number>(INITIAL_MATCHED_PAIRS); // Pares encontrados

  const handleCardClick = (clickedCard: Card) => {
    // Si la carta ya fue encontrada o está boca arriba, no hacemos nada
    if (clickedCard.isMatched || clickedCard.isFlipped || selectedCards.length === MAX_SELECTED_CARDS) return;

    // Volteamos la carta
    const newCards = cards.map(card =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    // Agregamos la carta a las cartas seleccionadas
    const newSelectedCards = [...selectedCards, clickedCard];
    setSelectedCards(newSelectedCards);

    //  Verificamos si hay un match
    if (newSelectedCards.length === MAX_SELECTED_CARDS) {
      setTimeout(() => checkMatch(newSelectedCards, newCards), 1000);
    }
  };

  // recibe las cartas seleccionadas y las cartas actuales
  const checkMatch = (selectedPair: Card[], currentCards: Card[]) => {
    // Obtenemos las cartas seleccionadas
    const [first, second] = selectedPair;

    // Si las cartas son iguales
    if (first.image === second.image) {
      // Marcamos las cartas como encontradas
      const matchedCards = currentCards.map(card =>
        card.id === first.id || card.id === second.id
          ? { ...card, isMatched: true }
          : card
      );
      // Actualizamos el mazo de cartas
      setCards(matchedCards);
      // Aumentamos el contador de pares encontrados
      setMatchedPairs(matchedPairs + INCREMENT);
    } else {
      // Si las cartas no son iguales, las volteamos de nuevo
      const resetCards = currentCards.map(card =>
        card.id === first.id || card.id === second.id
          ? { ...card, isFlipped: false }
          : card
      );
      // Actualizamos el mazo de cartas
      setCards(resetCards);
    }

    // Limpiamos las cartas seleccionadas
    setSelectedCards([]);
  };

  // Reiniciar el juego
  const resetGame = () => {
    setCards(createDeck());
    setSelectedCards([]);
    setMatchedPairs(INITIAL_MATCHED_PAIRS);
  };

  return (
    // Contenedor principal
    <div className="flex flex-col items-center p-4">
      {/* Título */}
      <h1 className="text-2xl font-bold mb-4">Juego de Memoria</h1>
      {/* Mazo de cartas */}
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
      {/* Mensaje de victoria */}
      {matchedPairs === 6 && (
        <div className="my-4 text-green-600 font-bold">
          ¡Ganaste el juego!
        </div>
      )}
      {/* Botón de reiniciar */}
      <button
        onClick={resetGame}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Reiniciar Juego
      </button>
    </div>
  );
}

export default App
