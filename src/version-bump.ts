import { getNewVersion } from "./get-new-version";
import { getOldVersion } from "./get-old-version";
import { gitCommit, gitPush, gitTag } from "./git";
import { Operation } from "./operation";
import { VersionBumpOptions } from "./types/version-bump-options";
import { VersionBumpResults } from "./types/version-bump-results";
import { updateFiles } from "./update-files";

/**
 * Prompts the user for a version number and updates package.json and package-lock.json.
 *
 * @returns - The new version number
 */
export async function versionBump(): Promise<VersionBumpResults>;

/**
 * Bumps the version number in package.json, package-lock.json.
 *
 * @param release
 * The release version or type. Can be one of the following:
 *
 * - The new version number (e.g. "1.23.456")
 * - A release type (e.g. "major", "minor", "patch", "prerelease", etc.)
 * - "prompt" to prompt the user for the version number
 */
export async function versionBump(release: string): Promise<VersionBumpResults>;

/**
 * Bumps the version number in one or more files, prompting the user if necessary.
 * Optionally also commits, tags, and pushes to git.
 */
export async function versionBump(options: VersionBumpOptions): Promise<VersionBumpResults>;

/**
 * Bumps the version number in one or more files, prompting the user if necessary.
 * Optionally also commits, tags, and pushes to git.
 */
export async function versionBump(arg: VersionBumpOptions | string = {}): Promise<VersionBumpResults> {
  if (typeof arg === "string") {
    arg = { release: arg };
  }

  let operation = await Operation.start(arg);

  // Get the old and new version numbers
  await getOldVersion(operation);
  await getNewVersion(operation);

  // Update the version number in all files
  await updateFiles(operation);

  // Git commit, tag, push (if enabled)
  await gitCommit(operation);
  await gitTag(operation);
  await gitPush(operation);

  return operation.results;
}