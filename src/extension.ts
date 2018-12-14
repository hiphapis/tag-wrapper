'use strict';
import { commands, window, TextDocument, TextEditorEdit, ExtensionContext, Position, SnippetString, Selection } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

  let disposable = commands.registerCommand('extension.wrapTag', () => {

    const editor = window.activeTextEditor;

    // if (!editor || !(editor.document.languageId === 'html')) return;
    if (!editor) return;

    let selection = editor.selection;
    let selectedText = editor.document.getText(selection);
    let wrapper = new TagWrapper(selectedText, selection);

    editor.insertSnippet(wrapper.snippet); //insert snippet to replace the selection text
  })

  context.subscriptions.push(disposable);
}


// this method is called when your extension is deactivated
export function deactivate() {
}


class TagWrapper {
  private replacementTag = 'div';
  private selectedText: string;

  constructor(selectedText: string, selection: Selection) {
    this.selectedText = this.formatSelectedText(selectedText, selection);
  }

  get snippet(): SnippetString {
    return this.generateSnippet();
  }

  private generateSnippet(): SnippetString {
    let sn = new SnippetString();

    sn.appendText('<')
    // sn.appendTabstop(1)
    sn.appendPlaceholder(`${this.replacementTag}`, 1)
    sn.appendText(`>\n${this.selectedText}</`)
    sn.appendPlaceholder(`${this.replacementTag}`, 1)
    sn.appendText('>')

    return sn;
  }

  //format multi line selected text
  private formatSelectedText(selectedText: string, selection: Selection): string {
    let start = selection.start.character;
    let textArr;
    let endLine;

    if (selectedText.indexOf('\n') > -1) {
      textArr = selectedText.split('\n')
      endLine = '\n'
    } else {
      textArr = selectedText.split('\r')
      endLine = '\r'
    }

    let formated = '';
    textArr.forEach((line, index) => {

      formated += index === 0 ? `\t${line}${endLine}` : `\t${line.substr(start)}${endLine}`;

    })

    return formated;
  };

  dispose() {
    // do nothing
  }
}
