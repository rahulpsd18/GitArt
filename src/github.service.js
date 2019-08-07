const axios = require('axios');
const GitHub = require('github-api');

export class GithubService {
    constructor(authToken) {
        this._emailId = undefined;
        this._repoName = undefined;
        this._repoInstance = undefined;
        this._userProfile = undefined;
        this._githubInstance = new GitHub({ token: authToken });
        this._userInstance = this._githubInstance.getUser();
    }

    set emailId(email) {
        this._emailId = email;
    }

    get isEmailPresent() {
        return !!this._emailId;
    }

    async setUserProfile() {
        this._userProfile = (await this._userInstance.getProfile()).data;
        this._emailId = this._userProfile.email
    }

    async createAndSetRepo(repoName) {
        this._repoName = repoName;
        this._userInstance.createRepo({
            name: this._repoName,
            description: "This is your hidden repository for GitArt",
            homepage: "https://github.com/rahulpsd18/gitArt",
            private: true,
            has_issues: false,
            has_projects: false,
            has_wiki: false,
            auto_init: true,
        });
        this._repoInstance = this._githubInstance.getRepo((await this._userInstance.getProfile()).data.login, this._repoName);
    }

    async createCommitAndUpdateHead(commitMessage, dateTime, initial) {
        const commits = await this._repoInstance.listCommits();
        const shaLatestCommit = commits.data[0].sha;
        const shaBaseTree = commits.data[0].commit.tree.sha;
        const newTree = await this._repoInstance.createTree([{
            "path": "README.md",
            "mode": "100644",
            "type": "blob",
            "content": commitMessage
        }], shaBaseTree);
        const shaNewTree = newTree.data.sha;
        const newCommit = await axios.post(`https://api.github.com/repos/${this._userProfile.login}/${this._repoName}/git/commits`, {
            "message": commitMessage,
            "author": {
                "name": this._userProfile.name,
                "email": this._emailId,
                "date": dateTime,
            },
            "parents": initial ? [] : [shaLatestCommit],
            "tree": shaNewTree,
        }, {
                headers: {
                    Authorization: `Bearer ${this._githubInstance.__auth.token}`
                }
            })
        const shaNewCommit = newCommit.data.sha;
        await this._repoInstance.updateHead('heads/master', shaNewCommit, initial);
    }
}


// const gh = new GithubService('2f673e987176c11c18ce137231fa337a6fa165a0');

// (async () => {
//     await gh.createAndSetRepo('demo');
//     await gh.setUserProfile();
//     if (!gh.isEmailPresent) {
//         gh.emailId = 'rahulpsd18@gmail.com';
//     }
//     // await gh.createInitialCommit();
//     await gh.createCommitAndUpdateHead('commit 1', new Date(), true);
//     await gh.createCommitAndUpdateHead('commit 2', new Date());
//     await gh.createCommitAndUpdateHead('commit 3', new Date());
//     await gh.createCommitAndUpdateHead('commit 4', new Date());

// })();
