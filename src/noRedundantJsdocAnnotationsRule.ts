import * as ts from 'typescript';
import * as Lint from 'tslint';
import { canHaveJsDoc, getJsDoc } from 'tsutils';

/**
 * A list of JSDoc @tags that are never allowed in TypeScript source.
 */
const JSDOC_TAGS_BLACKLIST = new Set([
  'abstract',
  'access',
  'augments',
  'class',
  'constant',
  'constructor',
  'constructs',
  'default',
  'enum',
  'exports',
  'extends',
  'function',
  'global',
  'implements',
  'instance',
  'interface',
  'lends',
  'member',
  'memberof',
  'mixes',
  'mixin',
  'module',
  'name',
  'namespace',
  'override',
  'private',
  'property',
  'protected',
  'public',
  'readonly',
  'record',
  'requires',
  'static',
  'template',
  'this',
  'type',
  'typedef'
]);

/**
 * A list of JSDoc @tags that may include a {type} declaration.
 * These will only be banned when that type is passed.
 */
const JSDOC_TAGS_WITH_TYPES = new Set(['const', 'export', 'param', 'return', 'returns']);

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'no-redundant-jsdoc-annotations',
    type: 'style',
    description: 'Disallows declaring JSDoc @tags that can be expressed by the TypeScript surface syntax.',
    descriptionDetails:
      "Disallows declaring JSDoc @tags or @annotations that may better expressed and/or better suited via Typescript's syntax. Typescript's syntax, of course, is strongly preferred given the type-related benefits that the language provides via hinting and at compilation time. Ultimately, this rule disallows annotations that can be extracted via Typescript's type engine.",
    rationale:
      "JSDoc provides the opportunity of expressing type definitions in Javascript comments via @tags or @annotations. However, most of those have a comparable and/or inherent way of being expressed by Typescript's syntax, therefore becoming redundant. Additionally, avoiding this type of redundancies may avoid conflicts with tooling that may add automatic JSDoc type annotations at compile time.",
    options: null,
    optionsDescription: 'No configuration options are available.',
    requiresTypeInfo: false,
    typescriptOnly: true
  };

  public static FAILURE_STRING_REDUNDANT_TAG(tagName: string): string {
    return `'@${tagName}' annotations are redundant in TypeScript code.`;
  }
  public static FAILURE_STRING_REDUNDANT_TAG_TYPE(tagName: string): string {
    return `Declaring a '{type}' on '@${tagName}' annotations is redundant in TypeScript code.`;
  }
  public static FAILURE_STRING_TAG_MISSING_DESCRIPTION(tagName: string): string {
    return `'@${tagName}' annotations are redundant in TypeScript code if they provide no description.`;
  }

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk);
  }
}

function walk(ctx: Lint.WalkContext<void>) {
  const { sourceFile } = ctx;

  return sourceFile.statements.forEach(function cb(node: ts.Node): void {
    if (canHaveJsDoc(node)) {
      for (const { tags } of getJsDoc(node, sourceFile)) {
        if (tags !== undefined) {
          for (const tag of tags) {
            checkTag(tag);
          }
        }
      }
    }
    return ts.forEachChild(node, cb);
  });

  function checkTag(tag: ts.JSDocTag): void {
    /** Check against tag blacklist */
    if (JSDOC_TAGS_BLACKLIST.has(tag.tagName.text)) {
      ctx.addFailureAtNode(tag.tagName, Rule.FAILURE_STRING_REDUNDANT_TAG(tag.tagName.text));
      return;
    }

    /** Check against list of tags that may have a type attribute */
    if (JSDOC_TAGS_WITH_TYPES.has(tag.tagName.text)) {
      const { typeExpression, comment } = tag as ts.JSDocReturnTag | ts.JSDocParameterTag;

      /** Case where a redundant {type} is declared */
      if (typeExpression !== undefined) {
        ctx.addFailureAtNode(tag.tagName, Rule.FAILURE_STRING_REDUNDANT_TAG_TYPE(tag.tagName.text));
      }

      /** Case where tag is redundant due to a lack of documentation */
      if (comment === '') {
        ctx.addFailureAtNode(tag.tagName, Rule.FAILURE_STRING_TAG_MISSING_DESCRIPTION(tag.tagName.text));
      }
    }
  }
}
