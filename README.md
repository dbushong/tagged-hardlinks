# Tagged Hardlinks

This is a proposal for, and reference implementation for a system of providing
hierarchical string tag assocations for arbitrary files, while working within
all standard (hardlink-supporting) *NIX filesystems, mostly transparently.

## Design Goals

* Does not require new tools; current directory browsers just see files 
    organized in directories
* Which also implies: no separate metadata database
* Doesn't result in duplicated files wasting space
* Supports hierarchical tags

## Directory Structure Proposal

1. Given a directory `/t` (an example) under which our tag structure is stored:
1. All file originals are stored, in any structure desired, in the
    `/t/.taghl-orig/` directory.  All other directories at the toplevel are
    tags.  Tagged trees **cannot** be nested (i.e. no directories with
    `.taghl-orig/` anywhere inside other directories with same)
1. To **tag** a file, it is hardlinked into a tag directory, with or without
    directory nesting or hierarchical tagging, inside a final directory named
    `_files`.  Here are some examples:
    * To tag `/t/.taghl-orig/upload-20200401/bob.jpg` as `people`, you would do:
        `mkdir -p /t/people && ln /t/.taghl-orig/upload-20200401/bob.jpg /t/people/bob.jpg`.
        If this forms a name collision, the target file should be auto-deduped
        (e.g. `bob2.jpg`)
    * To tag `/t/.taghl-orig/bob.jpg` as `people/work`, you could do:
        `mkdir -p /t/people/work && ln /t/.taghl-orig/bob.jpg /t/people/work/bob.jpg`.
1. To **untag** a file, remove the file from that tag's tree.  If that
    is the last file in any tag (or subtag) dir, remove the directory too.
1. To **find all tags** of `/t/people/bob.jpg` (or any other tagging or
    original), search the tree for matching inodes, so e.g.
    `find /t -samefile /t/.taghl-orig/upload-20200401/bob.jpg`
1. To **completely remove** a file from the tree, execute such a search and 
    remove all matches, doing the aforementioned directory cleanup along the 
    way as required.

## CLI Commands

* `tag init`: essentially `mkdir .taghl-orig`; requires that you're in an empty
    directory and creates `.taghl-orig/`
* All of the following commands assume you are immediately or deeply inside a
    compliant tag tree; they will search upward until they find `.taghl-orig/`
    (or fail)
* `tag import [--move] <file-or-dir> [...]`: copies (or moves) the file or
    directory given into `./.taghl-orig/`, deduping as required; echoes the
    resulting file name(s)
* `tag list <path/to/file> [...]`: lists all known unique tags for the given
    file(s)
* `tag add <tag> <path/to/file> [...]` adds a tag to given file(s)
* `tag rm [--all] <path/to/file> <tag> [...]` removes one or more tags from
    the given file, or with `--all` removes **all** copies of the given file