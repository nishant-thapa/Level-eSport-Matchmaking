// api/endpoints.js
// Centralized API route paths for easy maintenance

export const endpoints = {
  // Auth (OAuth only)
  getUser: "/api/user/get-user/",
  updateUser: "/api/user/update-profile/",
  googleSignup: "/api/user/google/auth/",
  appleSignup: "/api/user/apple/auth/",
  refreshToken: "/api/user/refresh-token/",


  // Games
  games: "/api/games/",
  getGameProfiles: "/api/games/profiles/",
  saveGameProfile: "/api/games/profiles/save/",


  // Challenges (Matchmaking)
  getUpcomingGames: "/api/challenges/official/",
  getOpenChallenges: "/api/challenges/customer-challenges/",
  createChallenge: "/api/challenges/create/",
  joinChallenge: "/api/challenges/join/",
  submitResult: "/api/results/submit/",
  getResult: "/api/results/get_result/",
  updateOnChallenge: "/api/challenges/update-on-challenge/",
  deleteChallenge: "/api/challenges/cancel/",
  leaveChallenge: "/api/challenges/leave/",
  getMatchesOnLoads: "/api/challenges/get-user-matches-on-loads/",
  getOpenChallengesOnLoads: "/api/challenges/get-open-challenges-on-loads/",
  confirmOpponent: "/api/challenges/confirm-opponent/",


    // Points
  getPointsIn: "/api/points/request-in/",
  getPointsOut: "/api/points/request-out/",
};

