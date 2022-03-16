# ql-github
Simple Node GQL client for GitHub

**Sample Query:**
```
query{
  githubAccount(id:"madran-dev"){
    login
    url
    public_repos
    followers
  }
}
```
