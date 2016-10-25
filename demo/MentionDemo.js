/**
 * example index
 */
import React from 'react';
import Tinymce from 'uxcore-tinymce';
import Mention, { ContenteditableEditor, TextareaEditor, InputEditor, TinymceMention } from '../src/index';
import Dialog from 'uxcore-dialog';

function formatter(data) {
    return data.map((item) => {
        return {
            text: item
        };
    });
}

let source = ['aaaaa', 'aabbb', 'aaccc', 'bbbcc', 'dddee', 'fffqq', 'pppaa', 'ppccc'];
let mockData = [
    {
        "emplId": "38900",
        "nickNameCn": "沧竹",
        "deptDesc": "安全部-安全技术与产品-开放安全",
        "hrStatus": "",
        "jobDesc": "总监",
        "orderNum": "1",
        "jobSubCount": 12,
        "havanaId": 917386119,
        "mobilePhone": "",
        "deptId": "",
        "email": "xiong.wang@taobao.com",
        "leader": true,
        "hasTeam": false,
        "jobTeamCount": 12,
        "name": "WANG XIONG",
        "id": "1050",
        "avatar": "//work.alibaba-inc.com/photo/38900.jpg",
        "pinyin": "",
        "avatarBig": ""
    },
    {
        "emplId": "45358",
        "nickNameCn": "秦予",
        "deptDesc": "数据技术及产品部-数据科学",
        "hrStatus": "",
        "jobDesc": "资深总监",
        "orderNum": "0",
        "jobSubCount": 0,
        "havanaId": 650455055,
        "mobilePhone": "",
        "deptId": "",
        "email": "amy.wangqy@alipay.com",
        "leader": false,
        "hasTeam": false,
        "jobTeamCount": 0,
        "name": "WANG QINYU",
        "id": "75222",
        "avatar": "//work.alibaba-inc.com/photo/45358.jpg?1361881993",
        "pinyin": "",
        "avatarBig": ""
    },
    {
        "emplId": "45924",
        "nickNameCn": "",
        "deptDesc": "综合支持部-置业部-平台中心",
        "hrStatus": "",
        "jobDesc": "资深专家",
        "orderNum": "0",
        "jobSubCount": 3,
        "havanaId": 1095274110879,
        "mobilePhone": "",
        "deptId": "",
        "email": "ally.wangl@alibaba-inc.com",
        "leader": true,
        "hasTeam": false,
        "jobTeamCount": 3,
        "name": "WANG LEI",
        "id": "76014",
        "avatar": "//work.alibaba-inc.com/photo/45924.jpg?1363620243",
        "pinyin": "",
        "avatarBig": ""
    },
    {
        "emplId": "67471",
        "nickNameCn": "",
        "deptDesc": "关联公司-11Main-Product&Research",
        "hrStatus": "",
        "jobDesc": "Development Intern",
        "orderNum": "1",
        "jobSubCount": 0,
        "havanaId": 1728150404,
        "mobilePhone": "",
        "deptId": "",
        "email": "hwang@alibaba-inc.com",
        "leader": false,
        "hasTeam": false,
        "jobTeamCount": 0,
        "name": "WANG, Haiyang",
        "id": "5986153",
        "avatar": "//work.alibaba-inc.com/photo/67471.jpg",
        "pinyin": "",
        "avatarBig": ""
    },
    {
        "emplId": "68699",
        "nickNameCn": "",
        "deptDesc": "关联公司-11Main-Sales&Marketing",
        "hrStatus": "",
        "jobDesc": "Category Manager",
        "orderNum": "0",
        "jobSubCount": 0,
        "havanaId": 1820630230,
        "mobilePhone": "",
        "deptId": "",
        "email": "ywang@alibaba-inc.com",
        "leader": false,
        "hasTeam": false,
        "jobTeamCount": 0,
        "name": "WANG, Yan",
        "id": "5996961",
        "avatar": "//work.alibaba-inc.com/photo/68699.jpg",
        "pinyin": "",
        "avatarBig": ""
    },
    {
        "emplId": "71821",
        "nickNameCn": "",
        "deptDesc": "国际事业部-IBDM&ICVS-海外市场-美国",
        "hrStatus": "",
        "jobDesc": "Office Manager",
        "orderNum": "0",
        "jobSubCount": 0,
        "havanaId": 2156383741,
        "mobilePhone": "",
        "deptId": "",
        "email": "stella.wang@alibaba-inc.com",
        "leader": false,
        "hasTeam": false,
        "jobTeamCount": 0,
        "name": "WANG, Yinghua",
        "id": "6125609",
        "avatar": "//work.alibaba-inc.com/photo/71821.jpg?1404355781",
        "pinyin": "",
        "avatarBig": ""
    },
    {
        "emplId": "58",
        "nickNameCn": "",
        "deptDesc": "OS事业群-OS TV事业部-商务合作",
        "hrStatus": "",
        "jobDesc": "资深总监",
        "orderNum": "0",
        "jobSubCount": 8,
        "havanaId": 1095274160586,
        "mobilePhone": "",
        "deptId": "",
        "email": "bean@alibaba-inc.com",
        "leader": true,
        "hasTeam": true,
        "jobTeamCount": 9,
        "name": "王志雷",
        "id": "3132",
        "avatar": "//work.alibaba-inc.com/photo/58.jpg?1378781324",
        "pinyin": "",
        "avatarBig": ""
    },
    {
        "emplId": "83",
        "nickNameCn": "纯臻",
        "deptDesc": "人力资源部-业务HR",
        "hrStatus": "",
        "jobDesc": "总监",
        "orderNum": "1",
        "jobSubCount": 1,
        "havanaId": 1095274200588,
        "mobilePhone": "",
        "deptId": "",
        "email": "chris_w@alibaba-inc.com",
        "leader": true,
        "hasTeam": false,
        "jobTeamCount": 1,
        "name": "王颖",
        "id": "3158",
        "avatar": "//work.alibaba-inc.com/photo/83.jpg",
        "pinyin": "",
        "avatarBig": ""
    },
    {
        "emplId": "144",
        "nickNameCn": "王建勋",
        "deptDesc": "综合支持部-置业部",
        "hrStatus": "",
        "jobDesc": "副总裁",
        "orderNum": "0",
        "jobSubCount": 4,
        "havanaId": 22045531,
        "mobilePhone": "",
        "deptId": "",
        "email": "wjxbill@taobao.com",
        "leader": true,
        "hasTeam": true,
        "jobTeamCount": 125,
        "name": "王建勋",
        "id": "3216",
        "avatar": "//work.alibaba-inc.com/photo/144.jpg",
        "pinyin": "",
        "avatarBig": ""
    },
    {
        "emplId": "158",
        "nickNameCn": "悦航",
        "deptDesc": "小微金服-人力资源部-业务HR",
        "hrStatus": "",
        "jobDesc": "高级人事专家",
        "orderNum": "0",
        "jobSubCount": 7,
        "havanaId": 418559989,
        "mobilePhone": "",
        "deptId": "",
        "email": "mashaw@alipay.com",
        "leader": true,
        "hasTeam": false,
        "jobTeamCount": 7,
        "name": "王珏",
        "id": "3228",
        "avatar": "//work.alibaba-inc.com/photo/158.jpg",
        "pinyin": "",
        "avatarBig": ""
    }
];

function getPersonData(keyword, next){
    setTimeout(function(){
        next(mockData);
    }, 100);
}

function personDataFormatter(data){
    data.forEach(function(item){
        item.displayName = item.name + (item.nickNameCn ? `(${item.nickNameCn})`: '');
    });
    return data;
}

function personPanelFormatter(data){
    return `<img src="${data.avatar}" width="25" height="25" title="${data.name}">${data.displayName} - ${data.emplId}`;
}

function personMentionFormatter(data){
    return `@${data.name}(${data.emplId})`;
}

export default class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultContent: 'default content',
            basicContent: 'basic content',
            personContent: '',
            readOnly: false,
            showDialog: false,
        };
    }
    onToggleReadOnly() {
        this.setState({
            readOnly: !this.state.readOnly,
        });
    }
    toggleDialog() {
        this.setState({
            showDialog: !this.state.showDialog,
        });
    }
    render(){
        return (
            <div>
                <button onClick={this.toggleDialog.bind(this)}>show dialog</button>
                <Dialog
                    title="mention in dialog"
                    visible={this.state.showDialog}
                    onOk={this.toggleDialog.bind(this)}
                    onCancel={this.toggleDialog.bind(this)}
                    formatter={formatter} >
                    <Mention
                        matchRange={[1, 6]}
                        formatter={personDataFormatter}
                        panelFormatter={personPanelFormatter}
                        source={getPersonData}>
                        <InputEditor
                            width={250}
                            height={30}
                            mentionFormatter={personMentionFormatter}
                            placeholder="input editor placeholder" />
                    </Mention>
                </Dialog>
                <div>
                    <label><input ref="readOnlyCheckbox" type="checkbox" checked={this.state.readOnly} onChange={this.onToggleReadOnly.bind(this)} />只读</label>
                </div>
                <h1>BASIC:</h1>
                <Mention
                    matchRange={[0, 6]}
                    source={source}
                    onChange={(e, content) => {
                        // console.log('change:', e, content, this);
                        // this.setState({
                        //     basicContent: content
                        // });
                    }}
                    formatter={formatter}>
                    <ContenteditableEditor
                        width={250}
                        height={150}
                        readOnly={this.state.readOnly}
                        placeholder="contenteditable editor placeholder"
                        defaultValue={this.state.defaultContent} />
                    <TextareaEditor
                        width={250}
                        height={100}
                        readOnly={this.state.readOnly}
                        placeholder="textarea editor placeholder"
                        defaultValue={this.state.defaultContent} />
                    <InputEditor
                        width={250}
                        height={30}
                        readOnly={this.state.readOnly}
                        placeholder="input editor placeholder"
                        defaultValue={this.state.defaultContent} />
                </Mention>
                <h1>SELECT PERSON:</h1>
                <Mention
                    matchRange={[2, 6]}
                    source={getPersonData}
                    formatter={personDataFormatter}
                    panelFormatter={personPanelFormatter}
                    onChange={(e, content) => {
                    }}>
                    <ContenteditableEditor
                        mentionFormatter={personMentionFormatter} />
                </Mention>
                <h1>Tinymce</h1>
                <TinymceMention
                    insertMode={'TEXT_NODE'}
                    source={getPersonData}
                    formatter={personDataFormatter}
                    mentionFormatter={personMentionFormatter}
                    panelFormatter={personPanelFormatter}>
                    <Tinymce
                        placeholder={'tinymce placeholder'} />
                </TinymceMention>
            </div>
        );
    }
}
