async function fetchLeetCodeTags(slug) {
  const query = {
    query: `\n            query getQuestionDetail($titleSlug: String!) {\n                question(titleSlug: $titleSlug) {\n                    topicTags { name slug }\n                }\n            }\n        `,
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
