import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import * as React from "react";
import { emailStyle } from "@/emails/email-styling";
import { Footer, FounderName } from "../components";
import { appName } from "@/config/config";
import { MailProps } from "@/libs/mails/mails";
import { RedditPostWithSearch } from "@/app/api/cron/reddit/send-mail/route";
import { stripString } from "@/libs/utils";

const utmTags = `?utm_source=email&utm_medium=email&utm_campaign=reddit-results`;

export const subject = "Reddit Results";

interface RedditResultsProps {
  posts: RedditPostWithSearch[];
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

          {posts.map((post, index) => (
            <React.Fragment key={post.id}>
              <Post post={post} />
              {index < posts.length - 1 && <Hr style={emailStyle.hr} />}
            </React.Fragment>
          ))}

          <Text style={emailStyle.paragraph}>I hope you enjoy using {appName}!</Text>
          <FounderName utmTags={utmTags} />
          <Footer />
        </Section>
      </Container>
    </Body>
  </Html>
);

const textStyle = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
  marginTop: "4px",
  marginBottom: "4px",
}

const tagStyle = {
  display: 'inline-block',
  padding: '2px 8px',
  backgroundColor: '#ffebee',
  color: '#525f7f',
  borderRadius: '4px',
  fontSize: '12px',
  marginRight: '8px',
  marginBottom: '8px',
};

const titleStyle = {
  ...textStyle,
  fontSize: '18px',
  fontWeight: 'bold' as const,
  marginBottom: '12px',
  color: '#b62121',
}

const metaStyle = {
  ...textStyle,
  fontSize: '14px',
  color: '#8898aa',
  marginTop: '8px',
}

const Post = ({ post }: { post: RedditPostWithSearch }) => (
  <div style={{
    marginBottom: '8px',
    paddingBottom: '8px',
  }}>
    <Link href={post.url}>
      <Text style={titleStyle}>{post.title}</Text>
    </Link>

    {post.selftext && (
      <Text style={{
        ...textStyle,
        marginBottom: '16px',
      }}>
        {stripString(post.selftext, 300)}
      </Text>
    )}

    <div>
      <span style={tagStyle}>limited features</span>
      {post.search?.name && <span style={tagStyle}>{post.search.name}</span>}
      <span style={tagStyle}>r/{post.subreddit}</span>
    </div>

    <div style={metaStyle}>
      Posted by {post.author} • {post.num_comments} comments
    </div>
  </div>
)

RedditResults.PreviewProps = {
  posts: [
    {
      subreddit: "Munich",
      title: "Buying second hand coffee machines in Munich?",
      selftext: "Hey everyone, I'm heading to Munich soon and was wondering if there are good platforms to find second hand stuff? Specifically higher end coffee machines.\n\nI'm from Singapore and noticed that some machines made in Germany might be cheaper there, especially second hand. Back home, machines like ECM, Profitec, and stuff are super expensive. Thought maybe it'd be a good chance to snag one while I'm there.\n\nAny locals or people who've bought second hand in Munich before? Are there sites like Craigslist, or apps people use? Or maybe even physical stores? I'd love to hear any advice!\n\nAlso, any tips on what to look out for when buying second hand? Not super experienced with machines beyond the entry-level ones, but I'd love to upgrade if I can find a good deal.\n\nAppreciate any help. Thanks!!",
      url: "https://www.reddit.com/r/Munich/comments/1j9dsz7/buying_second_hand_coffee_machines_in_munich/",
      permalink: "/r/Munich/comments/1j9dsz7/buying_second_hand_coffee_machines_in_munich/",
      created_utc: 1741762312,
      author: "Big_Claim_5496",
      num_comments: 10,
      search_id: "4eaac3fa-c3e4-48ae-aedf-10f9a133c19d",
      search: {
        name: "Munich",
      },
    },
    {
      subreddit: "Berlin",
      title: "Buying second hand coffee machines in Berlin?",
      selftext: "Hey everyone, I'm heading to Berlin soon and was wondering if there are good platforms to find second hand stuff? Specifically higher end coffee machines.\n\nI'm from Singapore and noticed that some machines made in Germany might be cheaper there, especially second hand. Back home, machines like ECM, Profitec, and stuff are super expensive. Thought maybe it'd be a good chance to snag one while I'm there.\n\nAny locals or people who've bought second hand in Berlin before? Are there sites like Craigslist, or apps people use? Or maybe even physical stores? I'd love to hear any advice!\n\nAlso, any tips on what to look out for when buying second hand? Not super experienced with machines beyond the entry-level ones, but I'd love to upgrade if I can find a good deal.\n\nAppreciate any help. Thanks!!",
      url: "https://www.reddit.com/r/Berlin/comments/1j9dsz7/buying_second_hand_coffee_machines_in_berlin/",
      permalink: "/r/Berlin/comments/1j9dsz7/buying_second_hand_coffee_machines_in_berlin/",
      created_utc: 1741762312,
      author: "Big_Claim_5496",
      num_comments: 10,
      search_id: "4eaac3fa-c3e4-48ae-aedf-10f9a133c19d",
      search: {
        name: "Munich",
      },
    }
  ]
} as RedditResultsProps;

RedditResults.subject = subject;
RedditResults.type = "transactional";
RedditResults.templateId = "reddit-results";
export default RedditResults;
