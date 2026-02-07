import MatchCard from "../index/MatchCard"


const CreatorMatchCard = ({
  game,
  win_pot,
  handleSendGameCredentials,
  handleResultUpload,
  handleDeleteChallenge,
  handleConfirmedOpponent,
}) => {
  return (
    <MatchCard
      game={game}
      win_pot={win_pot}
      isCreator={true}
      handleSendGameCredentials={handleSendGameCredentials}
      handleResultUpload={handleResultUpload}
      handleDeleteChallenge={handleDeleteChallenge}
      handleConfirmedOpponent={handleConfirmedOpponent}
    />
  )
}

export default CreatorMatchCard
