// File: src/utils/questionSuggestions.js

export const generateSuggestedQuestions = (content, previousQuestions = []) => {
    // Context-aware suggested follow-up questions based on the response content
    const lowerContent = content.toLowerCase();
    const questions = [];
    
    // Track topics already covered to avoid redundant suggestions
    const coveredTopics = new Set(previousQuestions.map(q => q.toLowerCase()));
    
    // Municipal leadership questions
    if (lowerContent.includes("mayor") || lowerContent.includes("urscheler")) {
      if (!topicCovered(coveredTopics, "mayor responsibilities"))
        questions.push("What are the mayor's responsibilities?");
      if (!topicCovered(coveredTopics, "contact mayor"))
        questions.push("How can I contact the mayor?");
    }
    
    // Historical Architectural Review Board questions
    if (lowerContent.includes("historical") && lowerContent.includes("architectural")) {
      if (!topicCovered(coveredTopics, "harb members"))
        questions.push("Who is on the Historical Architectural Review Board?");
      if (!topicCovered(coveredTopics, "harb purpose"))
        questions.push("What does the Historical Architectural Review Board do?");
      if (!topicCovered(coveredTopics, "harb application"))
        questions.push("How do I apply for HARB approval?");
    }
    
    // Payment and utilities questions
    if (lowerContent.includes("water") && (lowerContent.includes("bill") || lowerContent.includes("pay"))) {
      if (!topicCovered(coveredTopics, "water bill online"))
        questions.push("How do I pay my water bill online?");
      if (!topicCovered(coveredTopics, "water bill due"))
        questions.push("When are water bills due?");
    }
    
    // Office hours and contact questions
    if (lowerContent.includes("office") && lowerContent.includes("hours")) {
      if (!topicCovered(coveredTopics, "department contacts"))
        questions.push("How do I contact specific departments?");
      if (!topicCovered(coveredTopics, "holiday hours"))
        questions.push("What are the holiday office closures?");
    }
    
    // Trash and recycling questions
    if (lowerContent.includes("trash") || lowerContent.includes("recycling") || lowerContent.includes("waste")) {
      if (!topicCovered(coveredTopics, "recycling rules"))
        questions.push("What items can be recycled?");
      if (!topicCovered(coveredTopics, "bulk pickup"))
        questions.push("How do I schedule bulk item pickup?");
    }
    
    // Property and tax questions
    if (lowerContent.includes("property") || lowerContent.includes("tax")) {
      if (!topicCovered(coveredTopics, "property tax due"))
        questions.push("When are property taxes due?");
      if (!topicCovered(coveredTopics, "tax assessment"))
        questions.push("How is my property assessed for taxes?");
    }
    
    // Questions for when answer indicates no information was found
    if (lowerContent.includes("do not contain") || 
        lowerContent.includes("doesn't contain") || 
        lowerContent.includes("no information") ||
        lowerContent.includes("wasn't able to find")) {
      if (!topicCovered(coveredTopics, "who is the mayor"))
        questions.push("Who is the mayor?");
      if (!topicCovered(coveredTopics, "office hours"))
        questions.push("What are the office hours?");
      if (!topicCovered(coveredTopics, "water bill"))
        questions.push("How do I pay my water bill?");
    }
    
    // Always include some general questions if we don't have enough suggestions
    if (questions.length < 2) {
      const generalQuestions = [
        "Who is the mayor?",
        "What are the office hours?",
        "How do I pay my water bill?",
        "When is trash collection?",
        "Where can I find information about permits?",
        "How do I report a concern to the borough?"
      ];
      
      for (const q of generalQuestions) {
        if (questions.length >= 3) break;
        if (!topicCovered(coveredTopics, q)) {
          questions.push(q);
        }
      }
    }
    
    return questions.slice(0, 3); // Limit to 3 suggestions
  };
  
  // Helper function to check if a topic is already covered
  const topicCovered = (coveredTopics, topic) => {
    return Array.from(coveredTopics).some(t => 
      t.includes(topic.toLowerCase()) || 
      topic.toLowerCase().includes(t)
    );
  };
  
  // Export the helper function if needed elsewhere
  export { topicCovered };