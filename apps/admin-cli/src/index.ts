#!/usr/bin/env node
import { Option, program } from "@commander-js/extra-typings";

import "./env";

import { knowledgeUpserted } from "@sovoli/api/services";
import { db, eq, schema } from "@sovoli/db";

program
  .command("trigger-knowledge")
  .addOption(
    new Option("--type <type>", "type of knowledge").choices(
      schema.KnowledgeTypes,
    ),
  )
  .action(async ({ type }) => {
    const allKnowledges = await db.query.Knowledge.findMany({
      where: type ? eq(schema.Knowledge.type, type) : undefined,
    });

    console.log(
      `Triggering knowledge upserted event for ${allKnowledges.length} knowledges`,
    );
    await Promise.all(
      allKnowledges.map((knowledge) =>
        knowledgeUpserted({ knowledgeId: knowledge.id }),
      ),
    );
  });

program.parse();
