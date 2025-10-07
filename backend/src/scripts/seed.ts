import 'dotenv/config';
import { prisma } from '../config/prisma';

async function seed() {
  await prisma.approvalRequest.deleteMany();
  await prisma.prompt.deleteMany();
  await prisma.engagement.deleteMany();
  await prisma.pollOption.deleteMany();
  await prisma.poll.deleteMany();
  await prisma.episode.deleteMany();
  await prisma.character.deleteMany();
  await prisma.narrative.deleteMany();

  const narrative = await prisma.narrative.create({
    data: {
      id: 'echoes-of-lisboa',
      title: 'Echoes of Lisboa',
      logline: 'A time-bending fado singer channels the memories of old Lisbon to rally a divided city.',
      status: 'DRAFT',
      characters: {
        create: [
          {
            id: 'ines',
            name: 'Inês Duarte',
            archetype: 'Reluctant Oracle',
            description:
              'A modern fado singer who can hear the unresolved stories of the Alfama whenever she performs.'
          },
          {
            id: 'tiago',
            name: 'Tiago Carminho',
            archetype: 'Idealistic Producer',
            description: 'A podcast producer chronicling Lisbon’s transformation who partners with Inês.'
          },
          {
            id: 'maria',
            name: 'Maria das Ondas',
            archetype: 'Temporal Guide',
            description: 'A mythical figure from the Tagus river who keeps history from repeating itself.'
          }
        ]
      },
      episodes: {
        create: [
          {
            id: 'episode-1',
            title: 'Vibrations on Rua da Saudade',
            summary:
              'Inês uncovers a forgotten protest ballad whose lyrics reveal a hidden message for the present day.',
            order: 1,
            beats: [
              'Cold open with archival footage blending into Inês’ performance',
              'First vision of 1974 revolution night',
              'Audience poll to decide where the investigation goes next'
            ]
          },
          {
            id: 'episode-2',
            title: 'The Cartographer’s Echo',
            summary:
              'A street artist’s mural sends Inês and Tiago across the city hunting for a pattern of resistance.',
            order: 2,
            beats: [
              'Mapping clues on the studio wall',
              'Guest interview with an urban historian',
              'Fork in the story determined by community vote'
            ]
          }
        ]
      },
      polls: {
        create: [
          {
            id: 'poll-1',
            question: 'Which memory should Inês follow next?',
            options: {
              create: [
                { id: 'option-a', label: 'The river-side apparition', votes: 184 },
                { id: 'option-b', label: 'The unanswered radio call', votes: 231 },
                { id: 'option-c', label: 'The secret graffiti cipher', votes: 197 }
              ]
            }
          }
        ]
      },
      engagements: {
        create: [
          { id: 'eng-1', channel: 'instagram', impressions: 13450, clicks: 890 },
          { id: 'eng-2', channel: 'facebook', impressions: 8450, clicks: 420 }
        ]
      },
      prompts: {
        create: [
          {
            id: 'prompt-1',
            content:
              'Inês hears the city hum with a chord progression from 1974, guiding listeners to the Bairro Alto.'
          },
          {
            id: 'prompt-2',
            content: 'Tiago strings together archival snippets into a timeline that mirrors the audience poll results.'
          }
        ]
      }
    }
  });

  console.info('Seeded narrative', narrative.title);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
