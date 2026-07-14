import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
// @ts-ignore
import script from "./scripts/inlineComments.inline"
import style from "./styles/inlineComments.scss"

type Options = {
  provider: "github"
  options: {
    // owner/name of the repo holding the Discussions, e.g. "logos-co/assembly"
    repo: `${string}/${string}`
    // GraphQL node id of the repo (data-repo-id in giscus config)
    repoId: string
    // Discussion category name, e.g. "Announcements"
    category: string
    // GraphQL node id of the category (data-category-id in giscus config)
    categoryId: string
    // Base URL of the serverless worker (OAuth exchange + anonymous read proxy).
    // If empty, the client no-ops gracefully and nothing is rendered.
    apiBase?: string
    // how a page maps to a discussion "term". Matches the existing giscus mapping.
    mapping?: "url" | "title" | "pathname"
  }
}

export default ((opts: Options) => {
  const InlineComments: QuartzComponent = ({
    displayClass,
    fileData,
    cfg,
  }: QuartzComponentProps) => {
    // respect the same frontmatter opt-out as the built-in Comments component
    const disableComment: boolean =
      typeof fileData.frontmatter?.comments !== "undefined" &&
      (!fileData.frontmatter?.comments || fileData.frontmatter?.comments === "false")
    if (disableComment) {
      return <></>
    }

    return (
      <div
        class={classNames(displayClass, "inline-comments")}
        data-repo={opts.options.repo}
        data-repo-id={opts.options.repoId}
        data-category={opts.options.category}
        data-category-id={opts.options.categoryId}
        data-api-base={opts.options.apiBase ?? ""}
        data-mapping={opts.options.mapping ?? "pathname"}
        data-base-url={cfg.baseUrl ?? ""}
      ></div>
    )
  }

  InlineComments.afterDOMLoaded = script
  InlineComments.css = style

  return InlineComments
}) satisfies QuartzComponentConstructor<Options>
