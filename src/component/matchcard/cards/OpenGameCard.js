import MatchCard from "../index/MatchCard"


const OpenGameCard = ({
  win_pot,
  game,
  handleConfirmChallenge,
  forOpenGames = true,
}) => {

 

  return (
    <MatchCard
    win_pot={win_pot}
    game={game}
    handleConfirmChallenge={handleConfirmChallenge}
    forOpenGames={forOpenGames}
    />
  )






}

export default OpenGameCard
