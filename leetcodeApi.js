async function fetchLeetCodeTags(slug) {
  const query = {
    query: `query getQuestionDetail($titleSlug: String!) { question(titleSlug: $titleSlug) { topicTags { name slug } } }`,
    variables: { titleSlug: slug },
  };

  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(query),
    credentials: "same-origin",
  });

  if (!response.ok) return [];
  const data = await response.json();
  return data.data?.question?.topicTags?.map((tag) => tag.name) || [];
}

async function fetchLeetCodeProblemData(slug) {
  const query = {
    query: `query getQuestionDetail($titleSlug: String!) { question(titleSlug: $titleSlug) { title difficulty topicTags { name slug } } }`,
    variables: { titleSlug: slug },
  };

  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(query),
    credentials: "same-origin",
  });

  if (!response.ok) return null;
  const data = await response.json();
  const q = data.data?.question;
  if (!q) return null;
  return {
    title: q.title,
    difficulty: q.difficulty,
    tags: q.topicTags?.map((tag) => tag.name) || [],
  };
}