import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { emailStyle } from "@/emails/email-styling";
import { Footer, FounderName } from "../components";
import { appName } from "@/config/config";
import { RedditPost } from "@/libs/types";
import { MailProps } from "@/libs/mails/mails";

const utmTags = `?utm_source=email&utm_medium=email&utm_campaign=reddit-results`;

export const subject = "Reddit Results";

interface RedditResultsProps {
  posts: RedditPost[];
}

export const RedditResults = ({ posts }: MailProps<RedditResultsProps>) => (
  <Html>
    <Head />
    <Preview>I found some posts on Reddit that might be relevant to your search.</Preview>
    <Body style={emailStyle.main}>
      <Container style={emailStyle.container}>
        <Section style={emailStyle.box}>
          <Text style={emailStyle.paragraph}>Hey there,</Text>
          <Text style={emailStyle.paragraph}>
            I found some posts on Reddit that might be relevant to your search.
          </Text>
          
          <Text style={emailStyle.paragraph}>
            <strong>Here are the results for your search:</strong>
          </Text>

          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}

          <Text style={emailStyle.paragraph}>I hope you enjoy using {appName}!</Text>
          <FounderName utmTags={utmTags} />
          <Footer />
        </Section>
      </Container>
    </Body>
  </Html>
);

const Post = ({ post }: { post: RedditPost }) => (
  <div>
    <Link href={post.url}>{post.title}</Link>
    <p>{post.selftext}</p>
    <p>Subreddit: {post.subreddit}</p>
    <p>Author: {post.author}</p>
    <p>Number of comments: {post.num_comments}</p>
  </div>
)

RedditResults.PreviewProps = {
  posts: [
    {
      "subreddit": "Munich",
      title: "Buying second hand coffee machines in Munich?",
      selftext: "Hey everyone, I’m heading to Munich soon and was wondering if there are good platforms to find second hand stuff? Specifically higher end coffee machines.\n\nI’m from Singapore and noticed that some machines made in Germany might be cheaper there, especially second hand. Back home, machines like ECM, Profitec, and stuff are super expensive. Thought maybe it’d be a good chance to snag one while I’m there.\n\nAny locals or people who’ve bought second hand in Munich before? Are there sites like Craigslist, or apps people use? Or maybe even physical stores? I’d love to hear any advice!\n\nAlso, any tips on what to look out for when buying second hand? Not super experienced with machines beyond the entry-level ones, but I’d love to upgrade if I can find a good deal.\n\nAppreciate any help. Thanks!!",
      url: "https://www.reddit.com/r/Munich/comments/1j9dsz7/buying_second_hand_coffee_machines_in_munich/",
      permalink: "/r/Munich/comments/1j9dsz7/buying_second_hand_coffee_machines_in_munich/",
      created_utc: 1741762312,
      author: "Big_Claim_5496",
      num_comments: 10,
      search_id: "4eaac3fa-c3e4-48ae-aedf-10f9a133c19d"
    }
  ]
} as RedditResultsProps;

RedditResults.subject = subject;
RedditResults.type = "transactional";
RedditResults.templateId = "reddit-results";
export default RedditResults;
