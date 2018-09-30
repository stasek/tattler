import React from 'react';

export default class Audio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            url: '',
            sentences: [],
        };
        this._reload = this._reload.bind(this);
    }

    async componentDidMount() {
        try {
            this._menuCreate();
            const {text} = await this.props;
            this.setState({text: text});
            const sentences = Audio._splitToSentence(this.state.text);
            this.setState({sentences: sentences});
            const soundUrl = await this.getSoundUrl(this.state.sentences[0]);
            await this.setState({url: soundUrl});
        } catch (e) {
            console.log(e.toString());
        }
    };

    async getSoundUrl (sentence) {
        const body = new URLSearchParams();
        body.append('port', 1001);
        body.append('word', sentence);
        body.append('include_media', 1);
        body.append('app_word_forms', 0);

        return await fetch(
            'https://api.lingualeo.com/gettranslates?port=1001',
            { body, method: 'POST' }
        ).then((response) => response.json())
            .then((translate) => translate.sound_url
            )
    }

    async _reload() {
        try {
            const [, ...s] = await this.state.sentences;
            this.setState({sentences: s});
            const soundUrl = this.state.sentences[0] ? await this.getSoundUrl(this.state.sentences[0]) : '';
            this.state.sentences[0] || this._menuDestroy();
            this.setState({url: soundUrl});
        } catch (e) {
            console.log(e)
        }
    };

    static _splitToSentence(text) {
        return text.replace(/([.?!])\s*(?=[A-Z])/g, '$1|').split('|');
    };

    _menuCreate() {
        browser.contextMenus.create({
            id: 'speech_destroy',
            title: 'Stop',
            contexts: ['all'],
            icons: {
                "48": 'images/icons.png',
            },
            onclick: async () => {
                this.setState({sentences: []});
                await this._reload();
            }
        });
    }

    _menuDestroy() {
        browser.contextMenus.remove('speech_destroy');
    }

    render() {
        return (
            <div>
                {this.state.sentences &&
                <audio
                    src={this.state.url}
                    autoPlay={true}
                    onEnded={this._reload}/>
                }
            </div>
        );
    }
}