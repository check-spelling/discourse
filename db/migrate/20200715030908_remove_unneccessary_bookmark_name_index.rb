# frozen_string_literal: true

class RemoveUnnecessaryBookmarkNameIndex < ActiveRecord::Migration[6.0]
  def change
    remove_index :bookmarks, :name
  end
end
