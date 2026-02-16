CKEDITOR.editorConfig = function( config ) {

    config.removePlugins = 'resize';
    config.resize_enabled = false;
    config.removePlugins = 'elementspath';

    config.fontSize_sizes = '8/8px;9/9px;10/10px;11/11px;12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;72/72px';

    config.stylesSet = [
        { name: 'Clan-News', element: 'p', styles: { 'font-family': 'ClanforLBBW-News, sans-serif' } },
        { name: 'Clan-Book', element: 'p', styles: { 'font-family': 'ClanforLBBW-Book, sans-serif' } },
        { name: 'Clan-Medium', element: 'p', styles: { 'font-family': 'ClanforLBBW-Medium, sans-serif' } },
        { name: 'ClanNarr-Medium', element: 'p', styles: { 'font-family': 'ClanforLBBWNarr-Medium, sans-serif' } },
        { name: 'Clan-Bold', element: 'p', styles: { 'font-family': 'ClanforLBBW-Bold, sans-serif' } },
        { name: 'Clan-NewsItalic', element: 'p', styles: { 'font-family': 'ClanforLBBW-NewsItalic, sans-serif' } },
        { name: 'Clan-BookItalic', element: 'p', styles: { 'font-family': 'ClanforLBBW-BookItalic, sans-serif' } },
        { name: 'Clan-MediumItalic', element: 'p', styles: { 'font-family': 'ClanforLBBW-MediumItalic, sans-serif' } },
        { name: 'Clan-BoldItalic', element: 'p', styles: { 'font-family': 'ClanforLBBW-BoldItalic, sans-serif' } },

        { name: 'Clan-News inline', element: 'span', styles: { 'font-family': 'ClanforLBBW-News, sans-serif' } },
        { name: 'Clan-Book inline', element: 'span', styles: { 'font-family': 'ClanforLBBW-Book, sans-serif' } },
        { name: 'Clan-Medium inline', element: 'span', styles: { 'font-family': 'ClanforLBBW-Medium, sans-serif' } },
        { name: 'ClanNarr-Medium inline', element: 'span', styles: { 'font-family': 'ClanforLBBWNarr-Medium, sans-serif' } },
        { name: 'Clan-Bold inline', element: 'span', styles: { 'font-family': 'ClanforLBBW-Bold, sans-serif' } },
        { name: 'Clan-NewsItalic inline', element: 'span', styles: { 'font-family': 'ClanforLBBW-NewsItalic, sans-serif' } },
        { name: 'Clan-BookItalic inline', element: 'span', styles: { 'font-family': 'ClanforLBBW-BookItalic, sans-serif' } },
        { name: 'Clan-MediumItalic inline', element: 'span', styles: { 'font-family': 'ClanforLBBW-MediumItalic, sans-serif' } },
        { name: 'Clan-BoldItalic inline', element: 'span', styles: { 'font-family': 'ClanforLBBW-BoldItalic, sans-serif' } },

        
        { name: 'Sparkasse-Lt', element: 'p', styles: { 'font-family': 'Sparkasse_Lt, sans-serif' } },
        { name: 'Sparkasse-LtIt', element: 'p', styles: { 'font-family': 'Sparkasse_LtIt, sans-serif' } },
        { name: 'Sparkasse-Rg', element: 'p', styles: { 'font-family': 'Sparkasse_Rg, sans-serif' } },
        { name: 'Sparkasse-It', element: 'p', styles: { 'font-family': 'Sparkasse_It, sans-serif' } },
        { name: 'Sparkasse-Md', element: 'p', styles: { 'font-family': 'Sparkasse_Md, sans-serif' } },
        { name: 'Sparkasse-Bd', element: 'p', styles: { 'font-family': 'Sparkasse_Bd, sans-serif' } },
        { name: 'Sparkasse-BdIt', element: 'p', styles: { 'font-family': 'Sparkasse_BdIt, sans-serif' } },
        { name: 'SparkasseHead-Rg', element: 'p', styles: { 'font-family': 'SparkasseHead_Rg, sans-serif' } },
        { name: 'SparkasseSerif-Bd', element: 'p', styles: { 'font-family': 'SparkasseSerif_Bd, serif' } },
        { name: 'SparkasseSerif-BdIt', element: 'p', styles: { 'font-family': 'SparkasseSerif_BdIt, serif' } },
        { name: 'SparkasseSerif-Rg', element: 'p', styles: { 'font-family': 'SparkasseSerif_Rg, serif' } },
        { name: 'SparkasseSerif-It', element: 'p', styles: { 'font-family': 'SparkasseSerif_It, serif' } },

        { name: 'Sparkasse-Lt inline', element: 'span', styles: { 'font-family': 'Sparkasse_Lt, sans-serif' } },
        { name: 'Sparkasse-LtIt inline', element: 'span', styles: { 'font-family': 'Sparkasse_LtIt, sans-serif' } },
        { name: 'Sparkasse-Rg inline', element: 'span', styles: { 'font-family': 'Sparkasse_Rg, sans-serif' } },
        { name: 'Sparkasse-It inline', element: 'span', styles: { 'font-family': 'Sparkasse_It, sans-serif' } },
        { name: 'Sparkasse-Md inline', element: 'span', styles: { 'font-family': 'Sparkasse_Md, sans-serif' } },
        { name: 'Sparkasse-Bd inline', element: 'span', styles: { 'font-family': 'Sparkasse_Bd, sans-serif' } },
        { name: 'Sparkasse-BdIt inline', element: 'span', styles: { 'font-family': 'Sparkasse_BdIt, sans-serif' } },
        { name: 'SparkasseHead-Rg inline', element: 'span', styles: { 'font-family': 'SparkasseHead_Rg, sans-serif' } },
        { name: 'SparkasseSerif-Bd inline', element: 'span', styles: { 'font-family': 'SparkasseSerif_Bd, serif' } },
        { name: 'SparkasseSerif-BdIt inline', element: 'span', styles: { 'font-family': 'SparkasseSerif_BdIt, serif' } },
        { name: 'SparkasseSerif-Rg inline', element: 'span', styles: { 'font-family': 'SparkasseSerif_Rg, serif' } },
        { name: 'SparkasseSerif-It inline', element: 'span', styles: { 'font-family': 'SparkasseSerif_It, serif' } }
    ];
    

    config.toolbarGroups = [
        { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
        { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
        { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
        { name: 'forms', groups: [ 'forms' ] },
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
        '/',
        { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
        { name: 'links', groups: [ 'links' ] },
        { name: 'insert', groups: [ 'insert' ] },
        '/',
        { name: 'styles', groups: [ 'styles' ] },
        { name: 'colors', groups: [ 'colors' ] },
        { name: 'tools', groups: [ 'tools' ] },
        { name: 'others', groups: [ 'others' ] },
        { name: 'about', groups: [ 'about' ] },
        { name: 'customfont' }
    ];

    config.removeButtons = 'Save,ExportPdf,NewPage,Preview,Print,Templates,Find,Replace,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,CopyFormatting,RemoveFormat,CreateDiv,Blockquote,BidiLtr,BidiRtl,Language,Image,Flash,PageBreak,Iframe,About,ShowBlocks,Maximize';
};
