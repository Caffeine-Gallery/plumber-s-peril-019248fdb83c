import Func "mo:base/Func";
import Text "mo:base/Text";

import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Order "mo:base/Order";

actor {
  // Stable variable to store high scores across upgrades
  stable var highScores : [(Text, Int)] = [];

  // Function to add a new high score
  public func addHighScore(name : Text, score : Int) : async () {
    let newScores = Array.append(highScores, [(name, score)]);
    highScores := Array.sort<(Text, Int)>(
      newScores,
      func (a, b) {
        Int.compare(b.1, a.1)
      }
    );

    // Keep only top 10 scores
    highScores := Array.take(highScores, 10);
  };

  // Function to get high scores
  public query func getHighScores() : async [(Text, Int)] {
    highScores
  };

  // System functions for upgrades
  system func preupgrade() {
    // highScores is already stable, so no action needed
  };

  system func postupgrade() {
    // highScores is already stable, so no action needed
  };
}
